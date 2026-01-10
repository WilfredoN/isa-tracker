import type { Satellite } from '../../../types/satellite';
import { SatelliteEntity } from './SatelliteEntity';

type Props = { satellites: Satellite[] };

export const SatellitesLayer = ({ satellites }: Props) => (
  <>
    {satellites.map((satellite) => (
      <SatelliteEntity key={satellite.id} satellite={satellite} />
    ))}
  </>
);
