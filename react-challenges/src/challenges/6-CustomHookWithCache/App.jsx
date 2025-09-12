import React from "react";
import "./App.css";
import Cache from "./challenges/6-CustomHookWithCache/Cache";
import { FetchCacheProvider } from "./challenges/6-CustomHookWithCache/hooks/useFetch";

function App() {
  return (
    <div>
      <FetchCacheProvider>
      <Cache/>
      </FetchCacheProvider>
    </div>
  );
}

export default App;
