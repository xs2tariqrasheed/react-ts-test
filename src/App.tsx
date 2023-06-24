/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Prefectures from "./features/prefectures";
import initAxiosGlobalConfigs from "./utils/axiosConfg";

function App() {
  initAxiosGlobalConfigs();
  return (
    <main>
      <section>
        <Prefectures />
      </section>
    </main>
  );
}

export default App;
