import * as Cesium from 'cesium';

type TimelineWindow = {
  lookbackMinutes?: number;
  lookaheadMinutes?: number;
};

const DEFAULT_WINDOW: Required<TimelineWindow> = {
  lookbackMinutes: 15,
  lookaheadMinutes: 45,
};

const toJulianOffset = (base: Cesium.JulianDate, offsetMinutes: number) =>
  Cesium.JulianDate.addMinutes(base, offsetMinutes, new Cesium.JulianDate());

export const configureRealtimeClock = (viewer: Cesium.Viewer, window: TimelineWindow = {}) => {
  const clock = viewer.clock;
  const now = Cesium.JulianDate.now();
  const { lookaheadMinutes, lookbackMinutes } = { ...DEFAULT_WINDOW, ...window };

  viewer.allowDataSourcesToSuspendAnimation = false;
  clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
  clock.clockRange = Cesium.ClockRange.UNBOUNDED;
  clock.multiplier = 1;
  clock.currentTime = now;
  clock.shouldAnimate = true;

  if (viewer.clockViewModel) {
    viewer.clockViewModel.shouldAnimate = true;
  }

  if (viewer.timeline) {
    viewer.timeline.zoomTo(
      toJulianOffset(now, -lookbackMinutes),
      toJulianOffset(now, lookaheadMinutes),
    );
  }
};
