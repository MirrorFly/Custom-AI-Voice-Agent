import { useState, useEffect } from "react";
import "./App.css";
import SideMenu from "./components/SideMenu";
import { getSdkOptions } from "./utils/function";

function App() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    if (window.MirrorFlyAi) {
      // Initialize SDK once into a single shared container
      window.MirrorFlyAi.init({ container: "#ai-widget", ...getSdkOptions() });
    }
  }, []);

  return (
    <div className="app-container">
      <SideMenu />
      <div className="controls">
        <span>Mobile</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isTablet}
            onChange={(e) => setIsTablet(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
        <span>Tablet</span>
      </div>

      <div className="device-wrapper">
        <div className={`device-frame ${isTablet ? "is-tablet" : ""}`}>
          {/* Single shared container so the SDK is not re-mounted on toggle */}
          <div className="content" id="ai-widget"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
