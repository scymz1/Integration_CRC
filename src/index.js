import React from 'react';
import ReactDOM from 'react-dom/client';
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import VoyageApp from "./Component/VoyagePage/VoyageApp";
import Home from "./Component/HomePage/home";
import Home2 from "./Component/HomePage-darkmode/home";
import OptionSelector from "./Component/util/optionSelector";
import PASTApp from "./Component/PAST/PASTApp";
import DocumentsApp from "./Component/Documents/DocumentsApp";
import Map from './Component/VoyagePage/mapping/Map2';
import { ThemeProvider } from '@mui/material/styles';
import {theme} from "./Theme";
import SlavePage from "./Component/testScript/SlavePage";
import EnslaverPage from "./Component/testScript/EnslaverPage";

import VoyagePage from "./Newrefactor/VoyageApp/VoyagePage";
import DocumentPage from "./Newrefactor/DocumentsApp/DocumentPage";

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}/>
            {/* <Route path="voyage" element={<VoyageApp/>}/> */}
            <Route path="voyage" element={<VoyagePage/>}/>
            <Route path="voyage/:id" element={<VoyageApp/>}/>
            <Route path="home2" element={<Home2/>}/>
            <Route path="past" element={<PASTApp/>}/>
            <Route path="past/enslaved" element={<SlavePage/>}/>
            <Route path="past/enslaver" element={<EnslaverPage/>}/>
            <Route path="/geo/routes" element={<>
              <div><Map/>
              </div>
              <div>
                {/* <SankeyExample width={960} height={500}/> */}
              </div></>}/>
            {/* <Route path="documents" element={<DocumentsApp/>}/> */}
            <Route path="documents" element={<DocumentPage/>}/>
            <Route path="optionSelector" element={<OptionSelector/>}/>
            <Route path="refactor/voyage" element={<VoyagePage/>}/>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

