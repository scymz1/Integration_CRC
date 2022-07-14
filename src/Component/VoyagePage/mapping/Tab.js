import React, { useState, useEffect, useContext } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function IntraTabs(props) {
  const { disembark, setDisembark} = useContext(props.context);
  const [value, setValue] = React.useState('voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id');


  const handleChange = (event,newValue) => {
  console.log("🚀 ~ file: Tab.js ~ line 12 ~ handleChange ~ newValue", newValue)

    setValue(newValue);
    setDisembark(newValue)
  };

      console.log("🚀 ~ file: Tab.js ~ line 12 ~ IntraTabs handleChange ~ newValue", value)
    console.log("🚀 ~ file: Tab.js ~ line 8 ~ IntraTabs ~ disembark", disembark)

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab
          value="voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id"
          label="Port of embarkation"
        />
        <Tab value="voyage_itinerary__imp_principal_port_slave_dis__geo_location__id" label="Port of disembarkation" />
      </Tabs>
    </Box>
  );
}
