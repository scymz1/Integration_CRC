import React, { useState, useEffect, useContext } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function IntraTabs(props) {
  const { complete_object, set_complete_object} = useContext(props.context);
  const [value, setValue] = React.useState('voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id');
  const diskey = "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id" 
  const embkey = "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id" 

  const handleChange = (event,newValue) => {
    console.log("Change tab to: ", newValue)
    setValue(newValue);
    if (newValue === diskey ){
      //if currently search_object is embark
      //  const res = delete Object.assign(complete_object, {[diskey]: complete_object[embkey] })[embkey];
      //  set_complete_object(complete_object)

       

       var temp = complete_object[embkey]
      //  set_complete_object(_.omit(complete_object, embkey))

      //  set_complete_object(current => {
      //   const {embkey, ...complete_object} = current;
      //   return complete_object;
      // });
      //  set_complete_object({...complete_object, [diskey] : temp})
      // }

      const tempObject = {...complete_object}
      const id = tempObject[embkey]
      delete tempObject[embkey]
      set_complete_object( {...tempObject, [diskey]: id} )
      console.log("Disembark changed ===> set search object to disembark",complete_object, {...tempObject, [diskey]: id})

      }
    else{
      //  const res = delete Object.assign(complete_object, {[embkey]: complete_object[diskey] })[diskey];
      //  set_complete_object(complete_object)
       
       
       var temp = complete_object[diskey]
      //  set_complete_object(_.omit(complete_object, diskey))

      //  set_complete_object(current => {
      //   const {diskey, ...complete_object} = current;
      //   return complete_object;
      // });
      //  set_complete_object({...complete_object, [embkey] : temp})

      const tempObject = {...complete_object}
      const id = tempObject[diskey]
      delete tempObject[diskey]
      set_complete_object( {...tempObject, [embkey]: id} )
      console.log("Disembark changed ===> set search object to embark",complete_object, {...tempObject, [embkey]: id})
     }

    // console.log("🚀 ~ file: Spatial.js ~ line 176 ~ useEffect ~ complete_object", JSON.parse(JSON.stringify(complete_object)))
    
  };


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
