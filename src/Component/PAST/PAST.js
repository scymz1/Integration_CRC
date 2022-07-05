import ResponsiveAppBar from "../NavBar";
import * as React from "react";
import {Box, Button, Card, Modal, Tab, Tabs, Typography} from "@mui/material";
import Sankey from "./RelationGraph/Sankey"
import Network from './RelationGraph/Network'
import Story from './RelationGraph/Story'
import PASTTable from './PASTTable'

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
  return (
    <div>
      <ResponsiveAppBar/>
      <PASTTable/>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '50%'}}>
          <Box sx={{display: 'flex'}}>
            <Tabs
              orientation="vertical"
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
            <TabPanel value={value} index={0}>
              <Sankey/>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Network/>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Story target={[3, 5]} type="slave"/>
            </TabPanel>
          </Box>
        </Card>
      </Modal>

    </div>
  )
}