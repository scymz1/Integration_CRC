import React, { useState, useEffect, useContext } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Pivot from "../Result/Pivot/Pivot";
import { Grid } from "@mui/material";

// const diskey = "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id" 
// const embkey = "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id" 

var groupby_fields_region = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_region_slave_dis__geo_location__id",
];

var groupby_fields_port = [
  "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id",
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}



export default function IntraTabs(props) {
  const { complete_object, set_complete_object , disembark, setDisembark,layer} = useContext(props.context);
  const [value, setValue] = React.useState('purchase');
  const TabContext = React.createContext({});


  const handleChange = (event,newValue) => {
    event.stopPropagation()
    event.preventDefault()
    console.log("Change tab to: ", newValue, event)
    setValue(newValue);
    if(props.isRegion){
      setDisembark(newValue=="purchase"?groupby_fields_region[0]:groupby_fields_region[1]);
    }
    else{
      setDisembark(newValue=="purchase"?groupby_fields_port[0]:groupby_fields_port[1]);
    }
    

  };


  return (
    <TabContext.Provider value={{ complete_object, set_complete_object , disembark, setDisembark,layer}}>
    <Grid>
      {props.title}
      <div style={{ fontSize: "24px", color: "black" }}>
        <div>
          <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange}>
            <Tab
              value="purchase"
              label="Port of embarkation"
            />
            <Tab value="disembark" label="Port of disembarkation" />
            </Tabs>
            <TabPanel context={TabContext} value={value} index={"purchase"}>
              <Pivot context={TabContext} dispatch={props.dispatch}/> 
            </TabPanel>
            <TabPanel context={TabContext} value={value} index={"disembark"}>
              <Pivot context={TabContext} dispatch={props.dispatch}/> 
            </TabPanel>
          </Box>
        </div>
      </div>
    </Grid>
  </TabContext.Provider>
  );
}


