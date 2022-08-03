import React, {useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
import VoyageScatter from "./Component/VoyageScatter";
import VoyageBar from "./Component/VoyageBar";
import VoyagePie from "./Component/VoyagePie";
import Navbar from "../CommonComponent/NavBar";
import {useWindowSize} from "@react-hook/window-size";

import Filter from "../CommonComponent/Filter/Filter"

function TabPanel(props) {
  const { children, value, index } = props;
  const [width, height] = useWindowSize()
  return (
    <div role="tabPanel" hidden={value !== index} style={{ width: width, height: 0.885*height, margin: 20}}>
      {value === index && children}
    </div>
  );
}

export default function VoyagePage() {
  const [filter_object, set_filter_object] = useState({});
  const [dataset, setDataset] = useState("0");
  const state = {filter_object, set_filter_object, dataset, setDataset, pageType: "voyage"};

  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div>
      <Navbar state={state}/>
      <Filter state={state}/>
      <Box sx={{ flexGrow: 1, display: 'flex', height: "100%" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          sx={{ borderRight: 1, borderColor: 'divider', minWidth: 80}}
          onChange={(event, newValue) => {setValue(newValue);}}
        >
          <Tab label="Scatter" />
          <Tab label="Bar" />
          <Tab label="Pie" />
          <Tab label="Table" />
          <Tab label="Pivot" />
          <Tab label="Map" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <VoyageScatter state={state}/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VoyageBar state={state}/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <VoyagePie state={state}/>    
        </TabPanel>
        <TabPanel value={value} index={3}>
         Table
        </TabPanel>
        <TabPanel value={value} index={4}>
          Pivot
        </TabPanel>
        <TabPanel value={value} index={5}>
          Map
        </TabPanel>
      </Box>
    </div>
  )
}