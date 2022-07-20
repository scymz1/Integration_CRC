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

// import {autocomplete_text_fields, obj_autocomplete_text_fields, menu_label} from './var'
import { VoyageContext } from "../VoyageApp";

export const AppContext = React.createContext();

// const header = { "Authorization": process.env.REACT_APP_AUTHTOKEN }

export default function Filter(props) {
    const {options_flat, search_object, set_search_object, nested_tree, dataSet, typeForTable, page} = useContext(props.context);
    const [labels, setLabels] = React.useState([]);
    const [menuPosition, setMenuPosition] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Handle Drawer Open and Close
    const handleDrawerOpen = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(!drawerOpen);
    };

    // Handle delete by removing the specified key
    const handleDelete = (item) => { 
        // var raw = item.split("***")
        // var varName = raw[0]
        var varName = item.option
        let newObject = {...search_object};

        delete newObject[varName];
        set_search_object(newObject); 
        setLabels(labels.filter((e)=>e.option!==varName))
    };

  const color = (() =>{
    if(page === "voyage") {
      if(dataSet==="0") {
        return "voyageTrans"
      }else{
        return "voyageIntra"
      }
    }

    if(typeForTable === "enslavers"){
      return "success"
    }

    if(dataSet==="0") {
      return "primary"
    }else{
      return "secondary"
    }
  })()

    return (
    <AppContext.Provider
        value={{
          options_flat,
          menuPosition,
          setMenuPosition,
          labels,
          setLabels,
          nested_tree
      }}
    >
    <AppBar position="sticky" color={color} elevation={0}>
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <FilterAlt sx={{ color: "white" }}/>
        </IconButton>
        {!drawerOpen ?
            <Typography sx={{ color: "white" }}>Filter</Typography>
        :
            <Grid container direction="row" spacing={1}>
                {
                  Object.keys(nested_tree).map((key) => {
                    return(
                      <Cascading key={'cascading-' + key} menuName={key} button={nested_tree[key]} context={props.context}/>
                    )
                  })
                }
            </Grid>
        }
      </Toolbar>
    </AppBar>
    <Drawer
        className={"Selected Fields Drawer"}
        variant="persistent"
        anchor="bottom"
        open={drawerOpen}
        PaperProps={{ sx: { height: !labels.length ? "15%":"30%",  background:"#EAECEE"}}}
        style={{ position:'relative', zIndex:2 }}
    >
        <IconButton onClick={handleDrawerClose}>
            <ExpandMoreIcon />
        </IconButton>
        <Grid 
            container 
            spacing={0} 
            direction="column"
        >
            <Grid container item justifyContent="center" rowSpacing={2} columnSpacing={0.5} margin="auto" justify="center">
                {labels.length === 0 ? 
                    <Grid container item justifyContent="center">
                        <Typography color="#808B96">No Filter</Typography>
                    </Grid>
                :
                    labels.map((item, index) => {
                    return(
                      <Grid container item key={'grid-' + index} xs={6} justifyContent="center">
                          <Grid item xs={11} >
                              <Accordion>
                                  <AccordionSummary>
                                      <Typography>{options_flat[item.option].flatlabel}</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                      <ComponentFac params={item} index={index} context={props.context}/>
                                  </AccordionDetails>
                              </Accordion>
                          </Grid>
                          <Grid item xs={1} display="flex">
                              <IconButton onClick={()=>{handleDelete(item)}}>
                                  <RemoveCircleOutlineIcon />
                              </IconButton>
                          </Grid>
                      </Grid>
                    )})
                }
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
