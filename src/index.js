import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import VoyageApp from "./Component/VoyagePage/VoyageApp";
import Home from "./Component/HomePage/home";
import Home2 from "./Component/HomePage-darkmode/home";
import OptionSelector from "./Component/util/optionSelector";
import PASTApp from "./Component/PAST/PASTApp";

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="voyage/:id" element={<VoyageApp/>}/>
          <Route path="home2" element={<Home2/>}/>
          <Route path="past" element={<PASTApp/>}/>
          <Route path="optionSelector" element={<OptionSelector/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

