import Filter from "./Filter/Filter";
import Result from "./Result/Result";



import * as React from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import {useState} from "react";


function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
    >
      {value === index && (
        // <Container>
        <Box sx={{ p: 3 }}>
          <Filter />
          <Typography>{children}</Typography>
        </Box>
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
