import {Grid, IconButton, AppBar, Toolbar, Popover, Drawer} from "@mui/material";
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

    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const open = Boolean(anchorEl);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Handle Menu Click and Close
    //  const handleMenuClick = (event) => { 
    //      setAnchorEl(event.currentTarget);
    //  };
    //  const handleMenuClose = () => {
    //    setAnchorEl(null);
    //  };

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
        {/* <IconButton
          //  aria-describedby={id}
           variant="contained" 
           onClick={handleMenuClick}>
           <AutoAwesomeMotionIcon sx={{ color: "white" }}/>
        </IconButton>
        <Popover
              //  id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Grid container direction="row" spacing={1}>
                            {
                              Object.keys(menu_label).map((key) => {
                                return(
                                  <Cascading key={'cascading-' + key} menuName={key} button={menu_label[key]} context={props.context}/>
                                )
                              })
                            }
              </Grid>
        </Popover> */}
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
        PaperProps={{ sx: {width: "24%"} }}
        style={{ position:'relative', zIndex:2 }}
      >
        <br/><br/><br/><br/><br/><br/><br/><br/>
        <Grid container direction="row" spacing={2} alignItems="center">
            <Grid item sx={11} align="center">
              {output.map((item, index) => {
                return(
                  <Grid key={'grid-' + index} container direction="row" spacing={0} sx ={{m:'10px'}}>
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
              )})}
            </Grid>
            <Grid item sx={1} align="center">
              <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
              </IconButton>
            </Grid>
        </Grid>
    </Drawer>
  </AppContext.Provider>
  );
}
