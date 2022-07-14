import React, { useState, useEffect, useContext } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function IntraTabs(props) {
    const { complete_object,set_complete_object } = useContext(props.context);
  const [value, setValue] = React.useState('emb');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log("🚀 ~ file: Tab.js ~ line 12 ~ handleChange ~ newValue", newValue)
    console.log("tabbb",complete_object)
    //TODO: update search object based on embarkation/disembarkation selection (but how??)
   // set_complete_object(...)
        //    cachename: ['voyage_pivot_tables']
        // groupby_fields: (2) ['voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name', 'voyage_itinerary__imp_principal_region_slave_dis__geo_location__name']
        // value_field_tuple: (2) ['voyage_slaves_numbers__imp_total_num_slaves_disembarked', 'sum']
        // voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id: (2) [20828, 20828]
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab
          value="emb"
          label="Port of embarkation"
        />
        <Tab value="disemb" label="Port of disembarkation" />
      </Tabs>
    </Box>
  );
}
