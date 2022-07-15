import ResponsiveAppBar from "../NavBar";
import * as React from "react";
import {Box, Button, Card, Tab, Tabs, Typography,Dialog,AppBar,Toolbar,IconButton,Slide} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Sankey from "./RelationGraph/Sankey"
import Network from './RelationGraph/Network'
import Story from './RelationGraph/Story'
import PASTTable from './PASTTable'
import Filter from "../VoyagePage/Filter/Filter";
import {PASTContext} from "./PASTApp";
import {useContext} from "react";
import Modal from "../VoyagePage/Result/Table/TableModal";

function TabPanel(props) {
  const {children, value, index} = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{width: '100%'}}
    >{value === index && (
      <Box sx={{p: 3}}>
        {children}
      </Box>
    )}
    </div>
  );
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function PAST() {
  const [value, setValue] = React.useState(0);

  const {options_tree, options_flat, search_object, set_search_object, endpoint, windowRef, queryData, dialogopen, setdialogOpen} = useContext(PASTContext)
  //console.log(endpoint);
  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });


  return (
    <div>
      <ResponsiveAppBar/>
      <Button onClick={()=>console.log("options_tree:", options_tree)}>print options_tree</Button>
      <Button onClick={()=>console.log("options_flat:", options_flat)}>print options_flat</Button>
      <Button onClick={()=>console.log("search_object:", search_object)}>print search_object</Button>
      <Filter context={PASTContext}/>
      {/* <Button disabled={queryData["targets"].length === 0} onClick={handleClickOpen('body')}>Open modal</Button><br/> */}
      <PASTTable context={PASTContext} handleClickOpen={handleClickOpen}/>
      <Dialog
        fullScreen
        open={dialogopen}
        onClose={() => setdialogOpen(false)}
        // scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        TransitionComponent={Transition}
        ref={windowRef}
      >
        <AppBar sx={{ position: 'relative', background: 'white'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setdialogOpen(false)}
              aria-label="close"
            >
              <CloseIcon color="action"/>
            </IconButton>
            <Tabs
              variant="scrollable"
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue)
              }}
              sx={{borderRight: 1, borderColor: 'divider'}}
            >
              <Tab label="Sankey"/>
              <Tab label="Network"/>
              <Tab label="Story"/>
            </Tabs>
          </Toolbar>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Sankey/>
          <Modal context={PASTContext} endpoint="voyage/"/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Network/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Story target={500001} type="slave"/>
        </TabPanel>
      </Dialog>

    </div>
  )
}