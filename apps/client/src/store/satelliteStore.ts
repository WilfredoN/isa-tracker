import { create } from 'zustand';
import type { Satellite } from '../types/satellite';

type SatelliteState = {
  selectedSatellite: Satellite | null;
  selectSatellite: (satellite: Satellite) => void;
  clearSelection: () => void;
};

export const useSatelliteStore = create<SatelliteState>((set) => ({
  selectedSatellite: null,
  selectSatellite: (satellite) => set({ selectedSatellite: satellite }),
  clearSelection: () => set({ selectedSatellite: null }),
}));
