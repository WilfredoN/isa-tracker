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
import * as satellite from "satellite.js";
import "./style.css";

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN || "";

if (!Ion.defaultAccessToken) {
  throw new Error("Cesium Ion token is missing");
}

const ISS_TLE = `1 25544U 98067A   26003.53276902  .00013553  00000+0  25297-3 0  9999
2 25544  51.6327  34.5663 0007560 336.0107  24.0528 15.49066978546237`;

const ISS_TLE_FIRST_LINE = ISS_TLE.split("\n")[0].trim();
const ISS_TLE_SECOND_LINE = ISS_TLE.split("\n")[1].trim();

const satrec = satellite.twoline2satrec(
  ISS_TLE_FIRST_LINE,
  ISS_TLE_SECOND_LINE,
);

const viewer = new Viewer("cesiumContainer", {
  geocoder: IonGeocodeProviderType.GOOGLE,
});

try {
  const imageryLayer = viewer.imageryLayers.addImageryProvider(
    await IonImageryProvider.fromAssetId(3830186),
  );
  await viewer.zoomTo(imageryLayer);
} catch (error) {
  console.debug(error);
}

const totalSeconds = 60 * 60 * 6;
const stepInSeconds = 10;
const start = JulianDate.fromDate(new Date());

viewer.clock.clockRange = ClockRange.UNBOUNDED;
viewer.clock.clockStep = ClockStep.SYSTEM_CLOCK_MULTIPLIER;
viewer.clock.multiplier = 1;
viewer.clock.shouldAnimate = true;
viewer.clock.startTime = JulianDate.addSeconds(
  JulianDate.now(),
  -3600,
  new JulianDate(),
);
viewer.clock.stopTime = JulianDate.addSeconds(
  JulianDate.now(),
  3600,
  new JulianDate(),
);
viewer.clock.currentTime = JulianDate.now();

const timelineLead = 600;
const timelineTrail = 600;
viewer.timeline.zoomTo(
  JulianDate.addSeconds(JulianDate.now(), -timelineLead, new JulianDate()),
  JulianDate.addSeconds(JulianDate.now(), timelineTrail, new JulianDate()),
);

const positionsOverTime = new SampledPositionProperty();

for (let i = 0; i <= totalSeconds; i += stepInSeconds) {
  const time = JulianDate.addSeconds(start, i, new JulianDate());
  const jsDate = JulianDate.toDate(time);
  const pv = satellite.propagate(satrec, jsDate);
  if (!pv || !pv.position) {
    continue;
  }
  const gmst = satellite.gstime(jsDate);
  const geo = satellite.eciToGeodetic(pv.position, gmst);
  const cart = Cartesian3.fromRadians(
    geo.longitude,
    geo.latitude,
    geo.height * 1000,
  );
  positionsOverTime.addSample(time, cart);
}

const satellitePoint = viewer.entities.add({
  position: positionsOverTime,
  point: {
    pixelSize: 6,
    color: Color.RED,
    outlineColor: Color.WHITE,
    outlineWidth: 2,
  },
  orientation: new VelocityOrientationProperty(positionsOverTime),
  path: {
    show: true,
    leadTime: 0,
    trailTime: 60 * 10 * 10 * 10,
    width: 3,
    material: Color.YELLOW.withAlpha(0.9),
  },
});
