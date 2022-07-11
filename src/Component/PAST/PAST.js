import ResponsiveAppBar from "../NavBar";
import * as React from "react";
import {Box, Button, Card, Modal, Tab, Tabs, Typography,Dialog,AppBar,Toolbar,IconButton,Slide} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import Sankey from "./RelationGraph/Sankey"
import Network from './RelationGraph/Network'
import Story from './RelationGraph/Story'
import PASTTable from './PASTTable'
import Filter from "../VoyagePage/Filter/Filter";
import {PASTContext} from "./PASTApp";
import {useContext} from "react";

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

export default function PAST() {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const {options_tree, options_flat, search_object, set_search_object, endpoint} = useContext(PASTContext)
  const [scroll, setScroll] = React.useState('body');
  console.log(endpoint);
  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });
  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ResponsiveAppBar/>
      <Button onClick={()=>console.log("options_tree:", options_tree)}>print options_tree</Button>
      <Button onClick={()=>console.log("options_flat:", options_flat)}>print options_flat</Button>
      <Button onClick={()=>console.log("search_object:", search_object)}>print search_object</Button>
      <Filter context={PASTContext}/>
      <Button onClick={handleClickOpen('body')}>Open modal</Button><br/>
      <PASTTable context={PASTContext}/>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        // TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', background: 'white'}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
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

          {/* <Card sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '60%'}}> */}
          <Box>
            
            <TabPanel value={value} index={0}>
              <Sankey/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Network/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Story target={500001} type="slave"/>
            </TabPanel>
          </Box>
        {/* </Card> */}
      </Dialog>

    </div>
  )
}