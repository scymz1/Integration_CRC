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
    const [textInput, setTestInput] = React.useState("");
    const [value, setValue] = React.useState([]);
  
    const [labels, setLabels] = React.useState([]);
    const [output, setOutput] = React.useState([]);
    //console.log("🚀 ~ file: Filter.js ~ line 35 ~ Filter ~ output", output)
    const [menuPosition, setMenuPosition] = React.useState(null);



    return (
    <AppContext.Provider
    value={{
      name,
      setName,
      textInput,
      setTestInput,
      value,
      setValue,
      options_tree,
      menuPosition, 
      setMenuPosition,
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


