import {Button, Container, Grid, Card, CardHeader, CardContent, CardActions, IconButton} from "@mui/material";
import {useContext} from "react";
import {GlobalContext} from "../../App";

import React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import FilterAlt from '@mui/icons-material/FilterAlt';

import ComponentFac from './ComponentFac';
import Cascading from './Cascading'

import {autocomplete_text_fields, obj_autocomplete_text_fields} from './var'

export const AppContext = React.createContext();

const header={ "Authorization": 'Token 77e6b7487f5c3aa4275257eb5f77ad06e8c62a39'}

export default function Filter(props) {
    const {options_tree, search_object, set_search_object} = useContext(GlobalContext);
    
    const [name, setName] = React.useState(autocomplete_text_fields[0]);
    const [textInput, setTestInput] = React.useState("");
    const [value, setValue] = React.useState([]);
  
    const [labels, setLabels] = React.useState([]);
    const [output, setOutput] = React.useState([]);
    //console.log("🚀 ~ file: Filter.js ~ line 35 ~ Filter ~ output", output)
    const [menuPosition, setMenuPosition] = React.useState(null);
    
    // Handle delete by removing the specified key
    const handleDelete = (item) => { 
        var raw = item.split("***")
        var varName = raw[0]
        let newObject = {...search_object};
        delete newObject[varName];
        set_search_object(newObject); 
        setOutput(output.filter((e)=>e!==item))
        setLabels(labels.filter((e)=>e.option!==varName))
    };

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
          <Grid container direction={'col'} spacing={2}>
            <Grid item xs={2} align="center">
              <Cascading />
            </Grid>
            <Grid item xs={10}>
              <Card>
              {output.map((item) => {
                return(
                  <Card>
                    <CardHeader
                      title={item.split("***")[2]}
                      titleTypographyProps={{variant:'body1'}}
                      action={
                        <IconButton onClick={()=>{handleDelete(item)}}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        }
                    />
                    <CardContent>
                      <ComponentFac params={item} />
                    </CardContent>
                </Card>
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


