import * as React from "react";
import ColSelector from "../VoyagePage/Result/Table/ColSelector";
import Table from "../VoyagePage/Result/Table/Table";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
//import { Typography } from "@mui/material";
//import { styled } from "@mui/material/styles";
import { enslaved_default_list, enslaved_var_list } from "./vars";
import * as labels from "../util/enslaved_options.json";

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Grow from '@mui/material/Grow';
import FormControlLabel from '@mui/material/FormControlLabel';
import Gallery from "./Gallery.js"
import IconButton from '@mui/material/IconButton';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import TocIcon from '@mui/icons-material/Toc';

export const ColContext = React.createContext({});

export default function PASTTable(props) {
  const [cols, setCols] = React.useState(enslaved_default_list);
  const { options_tree, endpoint, queryData, setQueryData, search_object, data } =
    React.useContext(props.context);
  const [chipData, setChipData] = React.useState({});
  const stories = [<div>test</div>];

  const handleDelete = (chipToDelete) => () => {
    //setChipData((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
    delete chipData[chipToDelete];
    setQueryData({ ...queryData, targets: Object.keys(chipData).map(Number) });
  };

  const [checked, setChecked] = React.useState(false);

  function handleChange(e) {
    if((e == "table" && checked) || (e =="story" && !checked)) setChecked((prev) => !prev);
  };
  

  return (
    <div>
      {/* <Button onClick={()=>console.log("options_tree:", cols)}>print options_tree</Button> */}
      <ColContext.Provider
        value={{
          cols,
          setCols,
          endpoint,
          checkbox: true,
          modal: false,
          columnOptions: enslaved_var_list,
          options_flat: labels,
          queryData,
          setQueryData,
          search_object,
          chipData,
          setChipData,
        }}
      >
        <ColSelector context={ColContext} />
        <Card
          sx={{
            width: 800,
            //display: "flex",
            //justifyContent: "center",
            //flexWrap: "wrap",
            //listStyle: "none",
            // gap: 0.5,
            m: 1,
          }}
        >
          <CardHeader
            titleTypographyProps={{
              fontSize: 18,
              height: 5,
            }}
            title="Select items (MAX = 10)"
          />
          <CardContent>
            <Grid container spacing={1}>
              {Object.keys(chipData).map((data) => {
                return (
                  <Grid item key={data}>
                    <Chip
                      label={chipData[data] + " (" + data + ")"}
                      onDelete={handleDelete(data)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
          {/* <Button
            variant="outlined"
            sx={{
              m: 1,
              height: 32,
            }}
          >
            SHOW NETWORKS
          </Button> */}
        </Card>

    <Button variant="contained" startIcon={<TocIcon/>} size="large" color="grey" onClick={() => handleChange("table")} sx={{ ml: 3, mt:3, mb:5, mr: 1 }}>
      Table
    </Button>
    <a> </a>
    <Button variant="contained" endIcon={<DashboardCustomizeIcon />} size="large" color="grey" onClick={() => handleChange("story")} sx={{ mt:3, mb:5}}>
      Stories
    </Button>

    {!checked && <Box sx={{ height: 180 }}>
      <Box sx={{ display: 'flex' }} >
        {/* Conditionally applies the timeout prop to change the entry speed. */}
        <Grow
          in={!checked}
          style={{ transformOrigin: '0 0 0' }}
          {...(checked ? { timeout: 500 } : {})}
        >
          <div>
            <Table context={ColContext} />
          </div>
        </Grow>
      </Box>
      </Box>}

      <Box sx={{ display: 'flex' }}>
        <Grow in={checked}>
          <div>
          <Gallery />
          </div>
        </Grow>
      </Box>
        
      </ColContext.Provider>
    </div>
  );
}
