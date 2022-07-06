import {Box, Tab, Tabs, Typography} from "@mui/material";
import * as React from "react";
import {useParams} from "react-router-dom";
import ResponsiveAppBar from "../NavBar";
import Filter from "./Filter/Filter";
import Scatter from "./Result/Scatter";
import Bar from "./Result/Bar";
import Pie from "./Result/Pie";
import Table from "./Result/Table";
import Pivot from "./Result/Pivot";
import Map from "./Result/Map";

function TabPanel(props) {
  const {children, value, index} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      style={{width: '100%'}}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Voyage() {
  const [value, setValue] = React.useState(0);

  const {id} = useParams();

  React.useEffect(() => {
    switch (id) {
      case "Scatter":
        setValue(0)
        break;
      case "Bar":
        setValue(1)
        break;
      case "Pie":
        setValue(2)
        break;
      case "Table":
        setValue(3)
        break;
      case "Pivot":
        setValue(4)
        break;
      default:
        setValue(0)
    }
    //setValue(id?id:"Scatter")
  }, [])

  return (
    <div>
      <ResponsiveAppBar/>
      <Filter/>
      <Box sx={{bgcolor: 'background.paper', display: 'flex'}}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={(event, newValue) => {setValue(newValue)}}
          sx={{borderRight: 1, borderColor: 'divider'}}
        >
          <Tab label="Scatter"/>
          <Tab label="Bar"/>
          <Tab label="Pie"/>
          <Tab label="Table"/>
          <Tab label="Pivot"/>
          <Tab label="Map"/>
        </Tabs>
        <TabPanel value={value} index={0}>
          <Scatter/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Bar/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Pie/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Table/>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Pivot/>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Map/>
        </TabPanel>
      </Box>
    </div>
  );
}
