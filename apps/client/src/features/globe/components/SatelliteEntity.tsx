import { useMemo } from 'react';
import { Entity } from 'resium';
import * as Cesium from 'cesium';
import type { Satellite } from '../../../types/satellite';
import { tleToCartesian } from '../helpers/tleToCartesian';

type Props = { satellite: Satellite };

export const SatelliteEntity = ({ satellite }: Props) => {
  const position = useMemo(
    () =>
      new Cesium.CallbackPositionProperty(
        (time) => {
          const julian = time ?? Cesium.JulianDate.now();
          const current = Cesium.JulianDate.toDate(julian);
          return tleToCartesian(satellite.tle1, satellite.tle2, current);
        },
        false,
        Cesium.ReferenceFrame.FIXED,
      ),
    [satellite.tle1, satellite.tle2],
  );

  return (
    <Entity
      name={satellite.name}
      position={position}
      point={{ pixelSize: 8, color: Cesium.Color.CHARTREUSE }}
      label={{
        text: satellite.name,
        fillColor: Cesium.Color.CHARTREUSE,
        font: '12px Courier New',
        showBackground: true,
        backgroundColor: Cesium.Color.BLACK.withAlpha(0.7),
        horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
        pixelOffset: new Cesium.Cartesian2(10, 0),
      }}
      path={{
        resolution: 12,
        material: Cesium.Color.CHARTREUSE.withAlpha(0.6),
        width: 2,
        leadTime: 1800,
        trailTime: 900,
      }}
    />
  );
};
