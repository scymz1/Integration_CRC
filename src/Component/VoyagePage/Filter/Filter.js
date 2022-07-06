import {Button, Container, Grid, Card, CardHeader, CardContent, CardActions, IconButton, AppBar, Toolbar} from "@mui/material";
import {useContext} from "react";
// import {VoyageContext} from "../VoyageApp";

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
import RadioButton from "./radio";

// import {autocomplete_text_fields, obj_autocomplete_text_fields, menu_label} from './var'
import {VoyageContext} from "../VoyageApp";

export const AppContext = React.createContext();

const header={ "Authorization": process.env.REACT_APP_AUTHTOKEN}

export default function Filter(props) {
    const {options_tree, search_object, set_search_object, endpoint, menu_label} = useContext(props.context);
  
    const [labels, setLabels] = React.useState([]);
    const [output, setOutput] = React.useState([]);
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

    console.log('Current SEARCH OBJECT: ', search_object)

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

        <AppBar position="static">
          {/* <Toolbar disableGutters> */}
            <Grid container direction="row" spacing={1}>
                {
                  Object.keys(menu_label).map((key) => {
                    return(
                      <Cascading menuName={key} button={menu_label[key]} context={props.context}/>
                    )
                  })
                }
            </Grid>
          {/* </Toolbar>   */}
        </AppBar>


          <Grid container direction="row" sx ={{ gridTemplateColumns: 'repeat(3, 1fr)'}} spacing={10}>

            {/* {
              Object.keys(menu_label).map((key) => {
                return(
                  <Cascading menuName={key} button={menu_label[key]}/>
                )
              })
            } */}
            <Grid item>
              {output.map((item, index) => {
                return(
                  <Grid container direction="row" spacing={2} sx ={{m:'10px'}}>
                    <Grid item xs={11} align="center" >
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography>{item.split("***")[2]}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ComponentFac params={item} index={index} context={props.context}/>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>
                    <Grid item xs={1} align="center">
                      <IconButton onClick={()=>{handleDelete(item)}}>
                          <RemoveCircleOutlineIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                )})
              }
            </Grid>

            <Grid item >
              <RadioButton/>
            </Grid>
            
          </Grid>
          </AccordionDetails>
      </Accordion>
    </AppContext.Provider>
  );
}
