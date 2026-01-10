import { useShallow } from 'zustand/react/shallow';
import type { Satellite } from '../../../types/satellite';
import { useSatelliteStore } from '../../../store';
import { NoSatellites } from './NoSatellites';

type SatelliteListProps = {
  satellites: Satellite[];
};

export const SatelliteList = ({ satellites }: SatelliteListProps) => {
  const { selectedSatellite, selectSatellite, clearSelection } = useSatelliteStore(
    useShallow((state) => ({
      selectedSatellite: state.selectedSatellite,
      selectSatellite: state.selectSatellite,
      clearSelection: state.clearSelection,
    })),
  );

  const handleUlClick = (e: React.MouseEvent<HTMLUListElement>) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  };
  return (
    <ul className="flex-1 space-y-2 overflow-y-auto pr-1" onClick={handleUlClick}>
      {satellites.length === 0 ? (
        <NoSatellites />
      ) : (
        satellites.map((satellite) => {
          const isSelected = selectedSatellite && satellite.id === selectedSatellite.id;
          return (
            <li
              key={satellite.id}
              className={[
                'group flex cursor-pointer flex-col border-2 border-[var(--foreground)] px-3 py-2 transition-all',
                isSelected
                  ? 'bg-[var(--foreground)] text-[var(--background)] shadow-[var(--glow)]'
                  : 'bg-[var(--input)] hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:shadow-[var(--glow)]',
              ].join(' ')}
              onClick={() => selectSatellite(satellite)}
            >
              <span className="text-base font-bold uppercase tracking-wide">
                &gt; {satellite.name}
              </span>
              <span
                className={
                  'mt-1 font-mono text-xs opacity-80 ' +
                  (isSelected ? 'opacity-100' : 'group-hover:opacity-100')
                }
              >
                TLE1: {satellite.tle1}
              </span>
              <span
                className={
                  'font-mono text-xs opacity-80 ' +
                  (isSelected ? 'opacity-100' : 'group-hover:opacity-100')
                }
              >
                TLE2: {satellite.tle2}
              </span>
            </li>
          );
        })
      )}
    </ul>
  );
};
