// If have troubles, pick actual TLE data from https://celestrak.org/NORAD/elements/gp.php?GROUP=stations&amp;FORMAT=tle
// written as "ISS (ZARYA)" (should be first in the list)
const ISS_TLE = `1 25544U 98067A   26003.53276902  .00013553  00000+0  25297-3 0  9999
2 25544  51.6327  34.5663 0007560 336.0107  24.0528 15.49066978546237`;

const ISS_TLE_FIRST_LINE = ISS_TLE.split("\n")[0].trim();
const ISS_TLE_SECOND_LINE = ISS_TLE.split("\n")[1].trim();

const IMAGERY_ASSET_ID = 3830186;

const TOTAL_SECONDS = 60 * 60 * 6;
const STEP_IN_SECONDS = 10;
const TIMELINE_LEAD = 600;
const TIMELINE_TRAIL = 600;
const TRAIL_TIME = 60 * 10 * 10 * 10;

export {
  ISS_TLE_FIRST_LINE,
  ISS_TLE_SECOND_LINE,
  IMAGERY_ASSET_ID,
  TOTAL_SECONDS,
  STEP_IN_SECONDS,
  TIMELINE_LEAD,
  TIMELINE_TRAIL,
  TRAIL_TIME,
};
