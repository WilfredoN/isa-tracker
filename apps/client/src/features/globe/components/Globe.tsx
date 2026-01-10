import { useMemo, useRef } from 'react';
import { Viewer } from 'resium';
import type { CesiumComponentRef } from 'resium';
import type * as Cesium from 'cesium';
import { SatellitesLayer } from './SatellitesLayer';
import { useSatellites } from '../../../components/satellites/hooks/useSatellites';
import { ISS_PLACEHOLDER } from '../../../services/placeholderSatellite';
import { useRealtimeClock } from '../hooks/useRealtimeClock';

export const Globe = () => {
  const { satellites } = useSatellites('', true);
  const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
  useRealtimeClock(viewerRef);
  const sats = useMemo(() => {
    const issId = ISS_PLACEHOLDER.id;
    return [ISS_PLACEHOLDER, ...(satellites ?? []).filter((satellite) => satellite.id !== issId)];
  }, [satellites]);

  return (
    <div className="flex-1 border-2 border-[var(--foreground)] bg-[var(--panel-bg)] p-1 shadow-[var(--glow)]">
      <Viewer
        ref={viewerRef}
        baseLayerPicker={false}
        sceneModePicker={false}
        homeButton={false}
        timeline={true}
        fullscreenButton={false}
      >
        <SatellitesLayer satellites={sats} />
      </Viewer>
    </div>
  );
};
