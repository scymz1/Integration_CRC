import { Box, Tab, Tabs, Typography, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useParams } from "react-router-dom";
import ResponsiveAppBar from "../NavBar";
import Filter from "./Filter/Filter";
import Scatter from "./Result/Scatter";
import Bar from "./Result/Bar";
import Pie from "./Result/Pie";
import TableApp from "./Result/Table/TableApp";
import PivotApp from "./Result/Pivot/PivotApp";
import Map from "./Result/Map";
import { VoyageContext } from "./VoyageApp";
import SankeyExample from "./Sankey/CircularExample";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormLabel from "@mui/material/FormLabel";

import { Container } from "@mui/system";

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: "100%" }}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Voyage() {
  const [value, setValue] = React.useState(0);
  const [showSankey, setShowSankey] = React.useState(false);
  const { id } = useParams();
  const { typeForTable, setTypeForTable, search_object, set_search_object} = React.useContext(VoyageContext)
  const {id} = useParams();

  React.useEffect(() => {
    switch (id) {
      case "Scatter":
        setValue(0);
        break;
      case "Bar":
        setValue(1);
        break;
      case "Pie":
        setValue(2);
        break;
      case "Table":
        setValue(3);
        break;
      case "Pivot":
        setValue(4);
        break;
      default:
        setValue(0);
    }
    //setValue(id?id:"Scatter")
  }, []);

  return (
    <div>
      <ResponsiveAppBar
        search_object={search_object}
        set_search_object={set_search_object}
        typeForTable={typeForTable}
        setTypeForTable={setTypeForTable}
      />
      <Filter context={VoyageContext}/>
      <Box sx={{bgcolor: 'background.paper', display: 'flex'}}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="Scatter" />
          <Tab label="Bar" />
          <Tab label="Pie" />
          <Tab label="Table" />
          <Tab label="Pivot" />
          <Tab label="Map" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Scatter context={VoyageContext} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Bar context={VoyageContext} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Pie context={VoyageContext} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <TableApp context={VoyageContext} />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <PivotApp context={VoyageContext} />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <FormLabel id="boundingBoxFilter">Components Display</FormLabel>
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={()=>setShowSankey(false)}>
              Map Only
            </Button>
            <Button variant="outlined" onClick={()=>setShowSankey(true)}>Both Map and Sankey</Button>
          </Stack>

         
              {showSankey ? (
                 <Grid
                 container
                 spacing={2}
                 columns={16}
                 alignItems="center"
                 justify="center"
               >
                <Grid item xs={10}>
                <Map context={VoyageContext} />
              </Grid>
                <Grid item xs={6}>
                   <SankeyExample
                  width={960}
                  height={500}
                  context={VoyageContext}
                />
                </Grid>
                </Grid>
              ):
              <Grid
              container
              spacing={2}
              columns={16}
              alignItems="center"
              justify="center"
            >
              <Grid item xs={16}>
                 <Map context={VoyageContext} />
              </Grid>
              </Grid>
              }
        
        </TabPanel>
      </Box>
    </div>
  );
}
