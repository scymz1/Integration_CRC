import {Button, Container, Grid, Card, CardHeader, CardContent, CardActions, IconButton, AppBar, Toolbar, Popover} from "@mui/material";
import {useContext} from "react";
// import {VoyageContext} from "../VoyageApp";

import * as React from 'react';

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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    // Handle Button Click
    const handleClick = (event) => { 
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

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

    //console.log('Current SEARCH OBJECT: ', search_object)

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
      <IconButton
          aria-describedby={id}
          variant="contained" 
          onClick={handleClick}>
          <FilterAlt color="primary"/>
      </IconButton>
      <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
        {/* <Accordion>
          <AccordionSummary
            expandIcon={<FilterAlt />}
            aria-controls="filter-content"
            id="filter-header"
            sx={{
              backgroundColor: "#1D76D2"
            }}
          >
            <Typography>Filter</Typography>
          </AccordionSummary>
          <AccordionDetails> */}

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

            <Grid container direction="row" sx ={{ gridTemplateColumns: 'repeat(3, 1fr)'}} spacing={2}>

              {/* {
                Object.keys(menu_label).map((key) => {
                  return(
                    <Cascading menuName={key} button={menu_label[key]}/>
                  )
                })
              } */}
              <Grid item xs={2}>
                <RadioButton context={props.context}/>
              </Grid>
              <Grid item xs={10}>
                {output.map((item, index) => {
                  return(
                    <Grid container direction="row" spacing={0} sx ={{m:'10px'}}>
                      <Grid item xs={10} align="center" >
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                            <Typography>{item.split("***")[2]}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <ComponentFac params={item} index={index} context={props.context}/>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                      <Grid item xs={2} align="center">
                        <IconButton onClick={()=>{handleDelete(item)}}>
                            <RemoveCircleOutlineIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  )})
                }
              </Grid>
            </Grid>
            {/* </AccordionDetails>
        </Accordion> */}
      </Popover>
    </AppContext.Provider>
  );
}
