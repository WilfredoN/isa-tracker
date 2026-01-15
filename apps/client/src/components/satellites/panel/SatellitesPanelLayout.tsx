import type { ReactNode } from 'react';

export const SatellitesPanelLayout = ({ children }: { children: ReactNode }) => (
  <section className="border-(--foreground) bg-(--panel-bg) shadow-(--glow) flex h-full min-h-max w-full max-w-md flex-col gap-4 border-2 p-4">
    {children}
  </section>
);
