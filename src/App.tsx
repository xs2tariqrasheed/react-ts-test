/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Prefectures from "./features/prefectures";
import initAxiosGlobalConfigs from "./utils/axiosConfg";
import Example from "./features/prefectures/example";

function App() {
  initAxiosGlobalConfigs();
  return (
    <main>
      <section>
        <Prefectures />
        {/* <Example /> */}
      </section>
    </main>
  );
}

export default App;
