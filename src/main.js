window.CESIUM_BASE_URL = "/";
import {
  Cartesian3,
  ClockRange,
  ClockStep,
  Color,
  Ion,
  IonGeocodeProviderType,
  IonImageryProvider,
  JulianDate,
  SampledPositionProperty,
  VelocityOrientationProperty,
  Viewer,
} from "cesium";
import {
  IMAGERY_ASSET_ID,
  ISS_TLE_FIRST_LINE,
  ISS_TLE_SECOND_LINE,
  STEP_IN_SECONDS,
  TIMELINE_LEAD,
  TIMELINE_TRAIL,
  TOTAL_SECONDS,
  TRAIL_TIME,
} from "./constants";
import * as satellite from "satellite.js";
import "./style.css";

const initEnvironment = () => {
  Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || "";

  if (!Ion.defaultAccessToken) {
    throw new Error("Cesium Ion token is missing");
  }
};

const createViewer = (containerId = "cesiumContainer") => {
  return new Viewer(containerId, {
    geocoder: IonGeocodeProviderType.GOOGLE,
  });
};

const loadBaseImagery = async (viewer, assetId = IMAGERY_ASSET_ID) => {
  try {
    const imageryLayer = viewer.imageryLayers.addImageryProvider(
      await IonImageryProvider.fromAssetId(assetId),
    );
    await viewer.zoomTo(imageryLayer);
    return imageryLayer;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const configureClock = (
  viewer,
  { timePast = 3600, timeFuture = 3600, multiplier = 1 } = {},
) => {
  viewer.clock.clockRange = ClockRange.UNBOUNDED;
  viewer.clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
  viewer.clock.multiplier = 1;
  viewer.clock.shouldAnimate = true;
  viewer.clock.startTime = JulianDate.addSeconds(
    JulianDate.now(),
    -timePast,
    new JulianDate(),
  );
  viewer.clock.stopTime = JulianDate.addSeconds(
    JulianDate.now(),
    timeFuture,
    new JulianDate(),
  );
  viewer.clock.currentTime = JulianDate.now();
};

const configureTimeline = (
  viewer,
  { lead = TIMELINE_LEAD, trail = TIMELINE_TRAIL } = {},
) => {
  viewer.timeline.zoomTo(
    JulianDate.addSeconds(JulianDate.now(), -lead, new JulianDate()),
    JulianDate.addSeconds(JulianDate.now(), trail, new JulianDate()),
  );
};

const computePosition = (
  satrec,
  start = JulianDate.fromDate(new Date()),
  totalSeconds = TOTAL_SECONDS,
  step = STEP_IN_SECONDS,
) => {
  const positions = new SampledPositionProperty();

  for (let i = 0; i <= totalSeconds; i += step) {
    const time = JulianDate.addSeconds(start, i, new JulianDate());
    const jsDate = JulianDate.toDate(time);

    const propagationResult = satellite.propagate(satrec, jsDate);
    if (!propagationResult || !propagationResult.position) {
      continue;
    }

    const gmst = satellite.gstime(jsDate);
    const geo = satellite.eciToGeodetic(propagationResult.position, gmst);
    const cart = Cartesian3.fromRadians(
      geo.longitude,
      geo.latitude,
      geo.height * 1000,
    );
    positions.addSample(time, cart);
  }

  return positions;
};

const createSatellite = (viewer, positions, opts = {}) => {
  return viewer.entities.add({
    position: positions,
    point: {
      pixelSize: 6,
      color: Color.RED,
      outlineColor: Color.WHITE,
      outlineWidth: 2,
    },
    orientation: new VelocityOrientationProperty(positions),
    path: {
      show: true,
      leadTime: opts.leadTime ?? 0,
      trailTime: opts.trailTime ?? TRAIL_TIME,
      width: opts.pathWidth ?? 3,
      material: opts.material ?? Color.YELLOW.withAlpha(0.9),
    },
  });
};

const main = async () => {
  initEnvironment();

  const satrec = satellite.twoline2satrec(
    ISS_TLE_FIRST_LINE,
    ISS_TLE_SECOND_LINE,
  );
  const viewer = createViewer();

  await loadBaseImagery(viewer);

  configureClock(viewer);
  configureTimeline(viewer);

  const positionsOverTime = computePosition(satrec);

  createSatellite(viewer, positionsOverTime);
};

main().catch((error) => {
  console.error(error);
});
