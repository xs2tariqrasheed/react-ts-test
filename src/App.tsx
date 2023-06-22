import React from "react";
import "./App.css";
import Prefectures from "./features/prefectures";
function App() {
  return (
    <div>
      <header className="App-header">
        {process.env.REACT_APP_TITLE}
        <Prefectures />
      </header>
    </div>
  );
}

export default App;
