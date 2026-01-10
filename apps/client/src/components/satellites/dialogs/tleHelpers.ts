import type { AddSatelliteData } from '../../../types';

export const parseTLEPaste = (
  text: string,
  field: keyof AddSatelliteData,
  prev: AddSatelliteData,
): AddSatelliteData => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length >= 3 && lines[1].startsWith('1 ') && lines[2].startsWith('2 ')) {
    return { name: lines[0], tle1: lines[1], tle2: lines[2] };
  }
  if (lines.length === 2 && lines[0].startsWith('1 ') && lines[1].startsWith('2 ')) {
    return { ...prev, tle1: lines[0], tle2: lines[1] };
  }
  if (lines.length === 1) {
    if (lines[0].startsWith('1 ')) {
      return { ...prev, tle1: lines[0] };
    }
    if (lines[0].startsWith('2 ')) {
      return { ...prev, tle2: lines[0] };
    }
    return { ...prev, name: lines[0] };
  }
  return { ...prev, [field]: text };
};
