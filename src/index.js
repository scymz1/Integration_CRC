import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import VoyageApp from "./Component/VoyagePage/VoyageApp";
import Home from "./Component/HomePage/home";
import Home2 from "./Component/HomePage-darkmode/home";
import OptionSelector from "./Component/util/optionSelector";
import PASTApp from "./Component/PAST/PASTApp";
import Map from './Component/VoyagePage/mapping/Map2';
import SankeyExample from './Component/VoyagePage/Sankey/SankeyExample';
import dataset from './Component/VoyagePage/Sankey/dataset';

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
          {/* <Route path="/geo/routes" element={<><Map/> <SankeyExample data={dataset} width={960} height={500}/></>}/> */}
          <Route path="optionSelector" element={<OptionSelector/>}/>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

