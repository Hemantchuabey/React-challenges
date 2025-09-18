import React from "react";
import "./App.css";
import ProductPages from "./challenges/8-Data Table Optimization/pages/productPages";
import {BrowserRouter,Routes,Route} from 'react-router-dom'


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/table" element={<ProductPages/>}/>
    </Routes>
<ProductPages/>
    </BrowserRouter>
  );
}

export default App;
