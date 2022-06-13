import Filter from "./Filter/Filter";
import Result from "./Result/Result";
// import {useState} from "react";
// import React from "react";
// import {Container} from "@mui/material";

// export default function Voyage() {
//     return (
//         <Container sx={{border: 1}}>
//             <h1>Voyage</h1>
//             {/*<SideBar/>*/}
//             <Filter />
//             <Result />
//         </Container>
//     )
// }
import * as React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {useState} from "react";
import { Container } from "@mui/system";
// import Scatter from "../viz/Scatter";
// import Pie from "../viz/Pie";
// import Bar from "../viz/Bar";
// import Wraper from './Wraper';

function TabPanel(props) {
  const { children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{width:'100%'}}
      // id={`vertical-tabpanel-${index}`}
      // aria-labelledby={`vertical-tab-${index}`}
      // {...other}
    >
      {value === index && (
        // <Container>
        <Box sx={{ p: 3 }}>
          <Filter />
          <Typography>{children}</Typography>
        </Box>
        // {/* </Container> */}
      )}
    </div>
  );
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>

      
      <Box
        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex'}}
      >
      <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
      >
          <Tab label="Scatter"/>
          <Tab label="Bar" />
          <Tab label="Pie" />
      </Tabs>
      <TabPanel value={value} index={0}>
          <Result/>
      </TabPanel>
      </Box>
    </div>

  );
}
