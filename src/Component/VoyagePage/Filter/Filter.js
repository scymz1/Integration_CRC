import {Grid, IconButton, AppBar, Toolbar, Popover, Drawer, Divider} from "@mui/material";
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
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ComponentFac from './ComponentFac';
import Cascading from './Cascading'
// import RadioButton from "./radio";

// import {autocomplete_text_fields, obj_autocomplete_text_fields, menu_label} from './var'
import {VoyageContext} from "../VoyageApp";

export const AppContext = React.createContext();

const header={ "Authorization": process.env.REACT_APP_AUTHTOKEN}

export default function Filter(props) {
    const {options_tree, search_object, set_search_object, endpoint, menu_label} = useContext(props.context);

    const [labels, setLabels] = React.useState([]);
    const [output, setOutput] = React.useState([]);
    const [menuPosition, setMenuPosition] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    // Handle Drawer Open and Close
    const handleDrawerOpen = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(!drawerOpen);
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
    console.log('Current output: ', output)

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
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <FilterAlt sx={{ color: "white" }}/>
        </IconButton>
        <Grid container direction="row" spacing={1}>
                            {
                              Object.keys(menu_label).map((key) => {
                                return(
                                  <Cascading key={'cascading-' + key} menuName={key} button={menu_label[key]} context={props.context}/>
                                )
                              })
                            }
        </Grid>
      </Toolbar>
    </AppBar>
    <Drawer
        className={"Selected Fields Drawer"}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        docked={true}
        PaperProps={{ sx: {width: "25%"} }}
        style={{ position:'relative', zIndex:2 }}
    >
        <Toolbar />
        <Toolbar />
        <Grid 
            container 
            spacing={0} 
            direction="row"
        >
            <Grid item xs={10} justifyContent="center">
                {output.length === 0 ? 
                    <Grid container item sx={{m:'10px'}} justifyContent="center" >
                        <Typography>No Filter</Typography>
                    </Grid>
                  :
                  output.map((item, index) => {
                  return(
                    <Grid container key={'grid-' + index} direction="row" spacing={0} sx ={{m:'10px'}} justifyContent="center">
                        <Grid item xs={10} >
                          <Accordion>
                            {/* <AccordionSummary expandIcon={<ExpandMoreIcon/>}> */}
                            <AccordionSummary>
                              <Typography>{item.split("***")[2]}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <ComponentFac params={item} index={index} context={props.context}/>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                        <Grid item xs={2} display="flex">
                          <IconButton onClick={()=>{handleDelete(item)}}>
                              <RemoveCircleOutlineIcon />
                          </IconButton>
                        </Grid>
                    </Grid>
                )})}
            </Grid>
            <Grid container item sx={2} justifyContent="flex-end">
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </Grid>
        </Grid>
    </Drawer>
  </AppContext.Provider>
  );
}
