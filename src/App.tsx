/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Prefectures from "./features/prefectures";
import initAxiosGlobalConfigs from "./utils/axiosConfg";

function App() {
  initAxiosGlobalConfigs();
  return (
    <main>
      <p style={{ position: "absolute", top: 0, right: 50 }}>
        Test / Assignment: <b>Frontend (React)</b>
      </p>
      <p style={{ position: "absolute", top: 20, right: 50 }}>
        Made By:{" "}
        <b>
          <i>Tariq Rasheed</i>
        </b>
      </p>
      <section>
        <Prefectures />
      </section>
    </main>
  );
}

export default App;
