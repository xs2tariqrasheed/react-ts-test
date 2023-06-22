import React from "react";
import "./App.css";
import Prefectures from "./features/prefectures";
import initAxiosGlobalConfigs from "./utils/axiosConfg";

function App() {
  initAxiosGlobalConfigs();
  return (
    <div>
      <header className="App-header">
        <Prefectures />
      </header>
    </div>
  );
}

export default App;
