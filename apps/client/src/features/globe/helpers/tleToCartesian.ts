import * as Cesium from 'cesium';
import * as satellite from 'satellite.js';

export const tleToCartesian = (tleLine1: string, tleLine2: string, date: Date) => {
  const satelliteRecord = satellite.twoline2satrec(tleLine1, tleLine2);
  const positionAndVelocity = satellite.propagate(satelliteRecord, date);
  if (!positionAndVelocity || !positionAndVelocity.position) {
    return Cesium.Cartesian3.fromDegrees(0, 0, 0);
  }
  const greenwichMeanSiderealTime = satellite.gstime(date);
  const geodeticCoordinates = satellite.eciToGeodetic(
    positionAndVelocity.position,
    greenwichMeanSiderealTime,
  );
  const longitude = Cesium.Math.toDegrees(geodeticCoordinates.longitude);
  const latitude = Cesium.Math.toDegrees(geodeticCoordinates.latitude);
  const altitude = geodeticCoordinates.height * 1000;
  return Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
};
