import React, {useState} from "react";
import {Box, Tab, Tabs} from "@mui/material";
import VoyageScatter from "./Component/VoyageScatter";

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <div role="tabPanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && (
        <div>
          {children}
        </div>
      )}
    </div>
  );
}

export default function VoyagePage() {
  const [filter_object, set_filter_object] = useState({});
  const [dataset, setDataset] = useState(0);
  const state = {filter_object, set_filter_object, dataset};

  const [value, setValue] = useState(0);

  return (
    <div>
      <Box sx={{ flexGrow: 1, display: 'flex', height: "100%" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          sx={{ borderRight: 1, borderColor: 'divider' }}
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
          Bar
        </TabPanel>
        <TabPanel value={value} index={2}>
          Pie
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