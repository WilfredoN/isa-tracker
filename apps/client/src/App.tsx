import { Viewer } from "resium";
import "./App.css";
import { Input } from "./components/ui/input";

function App() {
  return (
    <div className="bg-blue-950 p-2 w-full h-full">
      <div className="flex flex-row h-full justify-between">
        <div className="border-4 border-blue-400 rounded-md max-w-1/3 w-full h-full flex flex-col p-4">
          <div className="flex flex-row gap-2">
            <Input />
          </div>
        </div>
        <div className="max-w-5xl w-full h-fit rounded-md border-4 border-blue-400 p-4">
          <Viewer
            baseLayerPicker={false}
            sceneModePicker={false}
            homeButton={false}
            timeline={false}
            fullscreenButton={false}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
