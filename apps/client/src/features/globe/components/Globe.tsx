import type * as CesiumType from 'cesium';
import { useEffect, useMemo, useRef } from 'react';
import type { CesiumComponentRef } from 'resium';
import { Viewer } from 'resium';
import { useSatellites } from '../../../components/satellites/hooks/useSatellites';
import { ISS_PLACEHOLDER } from '../../../services/placeholderSatellite';
import { useSatelliteStore } from '../../../store';
import { useRealtimeClock } from '../hooks/useRealtimeClock';

import { SatellitesLayer } from './SatellitesLayer';
import { SatelliteDetails } from './SatelliteDetails';

export const Globe = () => {
  const { satellites, error, isLoading, isFetching } = useSatellites('', true);
  const viewerRef = useRef<CesiumComponentRef<CesiumType.Viewer>>(null);
  const selectedSatellite = useSatelliteStore((state) => state.selectedSatellite);
  useRealtimeClock(viewerRef);
  const sats = useMemo(() => {
    const issId = ISS_PLACEHOLDER.id;
    if (error || isLoading || isFetching) {
      return [ISS_PLACEHOLDER];
    }
    if (!satellites || satellites.length === 0) {
      return [];
    }
    return satellites.filter((satellite) => satellite.id !== issId);
  }, [error, isLoading, isFetching, satellites]);

  useEffect(() => {
    if (!viewerRef.current?.cesiumElement) return;
    const viewer = viewerRef.current.cesiumElement;

    if (!selectedSatellite) {
      viewer.trackedEntity = undefined;

      viewer.scene.camera.flyHome(3);

      return;
    }
    try {
      const entity = viewer.entities.getById(selectedSatellite.id);
      if (entity) {
        viewer.flyTo(entity, { duration: 1.5 });
        viewer.trackedEntity = entity;
      }
    } catch (error) {
      console.error('Error flying to satellite:', error);
    }
  }, [selectedSatellite]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-(--foreground) bg-(--panel-bg) shadow-(--glow) h-fit border-2 p-1">
        <Viewer
          ref={viewerRef}
          baseLayerPicker={false}
          sceneModePicker={false}
          homeButton={false}
          animation={false}
          timeline={false}
          infoBox={false}
          navigationHelpButton={false}
          fullscreenButton={false}
          resolutionScale={1.5}
          useBrowserRecommendedResolution={true}
          skyBox={false}
          skyAtmosphere={false}
          shadows={false}
          scene3DOnly={true}
          creditContainer={undefined}
        >
          <SatellitesLayer satellites={sats} />
        </Viewer>
      </div>
      <SatelliteDetails />
    </div>
  );
};
