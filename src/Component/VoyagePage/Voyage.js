import Filter from "./Filter/Filter";
import * as React from 'react';
import {Box, Tab, Tabs, Typography} from "@mui/material";
import Scatter from "./Result/Scatter";
import Pie from "./Result/Pie";
import Bar from "./Result/Bar";
import ResponsiveAppBar from "../NavBar";


function TabPanel(props) {
  const {children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{width: '100%'}}
      // id={`vertical-tabpanel-${index}`}
      // aria-labelledby={`vertical-tab-${index}`}
      // {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Filter/>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Voyage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ResponsiveAppBar/>
      <Box sx={{bgcolor: 'background.paper', display: 'flex'}}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{borderRight: 1, borderColor: 'divider'}}
        >
          <Tab label="Scatter"/>
          <Tab label="Bar"/>
          <Tab label="Pie"/>
        </Tabs>
        <TabPanel value={value} index={0}>
          <Scatter/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {/* <Result/> */}
          <Bar/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          {/* <Result/>  */}
          <Pie/>
        </TabPanel>
      </Box>
    </div>
  );
}
