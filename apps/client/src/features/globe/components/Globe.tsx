import { useEffect, useMemo, useRef } from 'react';
import { Viewer } from 'resium';
import type { CesiumComponentRef } from 'resium';
import type * as Cesium from 'cesium';
import { SatellitesLayer } from './SatellitesLayer';
import { useSatellites } from '../../../components/satellites/hooks/useSatellites';
import { ISS_PLACEHOLDER } from '../../../services/placeholderSatellite';
import { useRealtimeClock } from '../hooks/useRealtimeClock';
import { useSatelliteStore } from '../../../store';

export const Globe = () => {
  const { satellites, error, isLoading, isFetching } = useSatellites('', true);
  const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
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
    <div className="border-(--foreground) bg-(--panel-bg) shadow-(--glow) h-fit flex-1 border-2 p-1">
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
      >
        <SatellitesLayer satellites={sats} />
      </Viewer>
    </div>
  );
};
