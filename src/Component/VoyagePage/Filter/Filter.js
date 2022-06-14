import {Button, Container, Grid, Card} from "@mui/material";
import {useContext} from "react";
import {GlobalContext} from "../../App";

import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import FilterAlt from '@mui/icons-material/FilterAlt';
import ComponentFac from './ComponentFac';
import Cascading from './Cascading'

import {autocomplete_text_fields, obj_autocomplete_text_fields} from './var'

export const AppContext = React.createContext();

const header={ "Authorization": 'Token bd233c83dceb9a0f70ffd2b47d6cd3a18a095260'}

export default function Filter(props) {
    const {options_tree, options_flat, search_object, set_search_object} = useContext(GlobalContext);
    
    const [name, setName] = React.useState(autocomplete_text_fields[0]);
    const [autoInput, setAutoInput] = React.useState("");
    const [autocompleteOptions, setautocompleteOptions] = React.useState([]);
    const [value, setValue] = React.useState([]);
    //label is a string 
    //eg. voyage_itinerary__port_of_departure__geo_location__child_of__name
    const [label, setLabel] = React.useState(autocomplete_text_fields[0]);

    //labels is an object
    //eg. {option: 'voyage_itinerary__int_first_region_purchase_slaves__geo_location__location_type__name', type: "<class 'rest_framework.fields.CharField'>", label: 'Itinerary : First intended region of purchase of s…cation : Location Type : Geographic Location Type'}
    const [labels, setLabels] = React.useState([]);
    const [output, setOutput] = React.useState([]);
    const [menuPosition, setMenuPosition] = React.useState(null);


    React.useEffect(()=>{
        console.log('use effect fetch dropdown options')
        const fetchData = async (labels,autoInput) => {
           console.log("Labels: ----->", labels)
          var formdata = new FormData();
          formdata.append(labels.option, autoInput);

          console.log("🚀 ~ label, autoInput", label, autoInput)
          var requestOptions = {
              method: 'POST',
              headers: header,
              body: formdata,
              redirect: 'follow'
          };
          fetch("https://voyages3-api.crc.rice.edu/voyage/autocomplete", requestOptions)
          .then(response => response.json())
          .then(result => {
              console.log("🚀YAYAYAY fetch is successful!!! result", result)
              var newOptions = result[labels.option]
              console.log("🚀 ~ file: Dropdown.js ~ line 43 ~ fetchData ~ newOptions", newOptions)
              setautocompleteOptions(newOptions) })
        }
  
        fetchData(labels[labels.length-1],autoInput).catch(console.error)
      },[labels,autoInput])


    return (
    <AppContext.Provider
    value={{
      name,
      setName,
      autoInput,
      setAutoInput,
      autocompleteOptions,
      setautocompleteOptions,
      value,
      setValue,
      options_tree,
      menuPosition, 
      setMenuPosition,
    //   isLoading,
      setOutput,
      output,
      labels,
      setLabels

    }}
  >

      <Accordion>
        <AccordionSummary
          expandIcon={<FilterAlt />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Filter</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container direction={'row'} spacing={2} alignItems="center" justify = "center">
            <Grid item xs={4} >
              <Cascading />
              {/* <Dropdown/> */}
            </Grid>
            <Grid item xs={8}>
              <Card>
              {output.map((item) => {
                return(
                  <Grid margin={3} >
                    <Grid item>
                      <ComponentFac params={item} />
                    </Grid>
                  </Grid>
                )})
              }
              </Card>
            </Grid>
          </Grid>
          </AccordionDetails>
        </Accordion>
    </AppContext.Provider>
  );
}


