import './App.css';
import { SatellitesPanel } from './components/satellites/panel/SatellitesPanel';
import { Globe } from './features/globe/components/Globe';

const App = () => (
  <div className="flex h-full w-full flex-row gap-2 bg-[var(--background)] p-2">
    <SatellitesPanel />
    <Globe />
  </div>
);

export default App;
