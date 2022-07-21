import {Grid, IconButton, AppBar, Toolbar, Popover, Drawer, Divider} from "@mui/material";
import {useContext} from "react";
// import {VoyageContext} from "../VoyageApp";

import * as React from 'react';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import ComponentFac from './ComponentFac';
import Cascading from './Cascading'

// import {autocomplete_text_fields, obj_autocomplete_text_fields, menu_label} from './var'
import { VoyageContext } from "../VoyageApp";

export const AppContext = React.createContext();

// const header = { "Authorization": process.env.REACT_APP_AUTHTOKEN }

export default function Filter(props) {
    const {options_flat, search_object, set_search_object, drawerOpen, setDrawerOpen, handleDrawerOpen, handleDrawerClose, nested_tree, dataSet, typeForTable, page} = useContext(props.context);
    const [labels, setLabels] = React.useState([]);
    const [menuPosition, setMenuPosition] = React.useState(null);
    const [fullScreen, setFullScreen] = React.useState(false);
    const [width, setWidth] = React.useState(12);
    const [margin, setMargin] = React.useState("10px");
    // const [drawerOpen, setDrawerOpen] = React.useState(false);

    // Handle Drawer Open and Close
    // const handleDrawerOpen = () => {
    //     setDrawerOpen(!drawerOpen);
    // };
    // const handleDrawerClose = () => {
    //     setDrawerOpen(!drawerOpen);
    // };

    // Handle Full Screen
    const handleFullScreen = () =>{
        setFullScreen(!fullScreen);
        setWidth(width === 12 ? 5:12);
        setMargin(margin === "10px" ? "2px":"10px");
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
    {drawerOpen ?
        <AppBar position="fixed" color={color} elevation={0} style={{zIndex:3, marginTop:"68px"}}>
            <Toolbar>
                {/* <IconButton
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                >
                <FilterAlt sx={{ color: "white" }}/>
                </IconButton>
                {!drawerOpen ?
                    <Typography sx={{ color: "white" }}>Filter</Typography>
                : */}
                    <Grid container direction="row" spacing={1}>
                        {
                        Object.keys(nested_tree).map((key) => {
                            return(
                            <Cascading key={'cascading-' + key} menuName={key} button={nested_tree[key]} context={props.context}/>
                            )
                        })
                        }
                    </Grid>
                {/* } */}
            </Toolbar>
        </AppBar>: 
        null}
    {/* <Drawer
        className={"Selected Fields Drawer"}
        variant="persistent"
        anchor="bottom"
        open={drawerOpen}
        PaperProps={{ sx: { height: !labels.length ? "15%":"30%",  background:"#EAECEE" }}}
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
                          <Grid item xs={1} >
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
    </Drawer> */}
    <Drawer
        className={"Selected Fields Drawer"}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        PaperProps={{ sx: { width: fullScreen?"100%":"25%", background:"#EAECEE" }}}
        // PaperProps={{ sx: { width: fullScreen?"100%":"25%", height: "80%", marginTop: "128px", background:"#EAECEE" }}}
        style={{ position:'relative', zIndex:2 }}
    >
        <Toolbar />
        <Toolbar />
        <Divider />
        <Grid container item justifyContent="flex-end"> 
                <IconButton onClick={handleFullScreen}>
                    {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon/>}
                </IconButton>
        </Grid>
        <Grid 
            container 
            spacing={0} 
            // justifyContent="center"
            direction="column"
        >
        <Divider />
            <Grid container item justifyContent="center" rowSpacing={2} columnSpacing={0.5} justify="center">
                {labels.length === 0 ? 
                    <Grid container item justifyContent="center" >
                        <Typography color="#808B96">No Filter</Typography>
                    </Grid>
                :
                    labels.map((item, index) => {
                    return(
                      <Grid container key={'grid-' + index} xs={width} sx={{m:margin}} justifyContent="center">
                          <Grid item xs={10} >
                              <Accordion>
                                  <AccordionSummary>
                                      <Typography>{options_flat[item.option].flatlabel}</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                      <ComponentFac params={item} index={index} context={props.context}/>
                                  </AccordionDetails>
                              </Accordion>
                          </Grid>
                          <Grid item xs={2}>
                              <IconButton onClick={()=>{handleDelete(item)}}>
                                  <RemoveCircleOutlineIcon />
                              </IconButton>
                          </Grid>
                      </Grid>
                    )})
                }
            </Grid>
        </Grid>
        <Divider />
        <Grid container item justifyContent="flex-end">
                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
        </Grid>
    </Drawer>
    </AppContext.Provider>
  );
}
