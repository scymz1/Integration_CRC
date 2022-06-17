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

const header={ "Authorization": process.env.REACT_APP_AUTHTOKEN}

export default function Filter(props) {
    const {options_tree, search_object, set_search_object} = useContext(GlobalContext);


  
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

    const handlePrint = (item) => {
        console.log('Current SEARCH OBJECT: ', search_object)
    }

    return (
    <AppContext.Provider
    value={{
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
              {output.map((item, index) => {
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
                      <ComponentFac params={item} index={index} />
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={()=>{handlePrint(item)}}>
                            <ExpandMoreIcon/>
                        </IconButton>
                    </CardActions>    
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


