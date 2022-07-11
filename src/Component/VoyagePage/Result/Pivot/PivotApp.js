import Pivot from "./Pivot";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormControlLabel, RadioGroup } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { pivot_row_vars, pivot_col_vars, pivot_cell_vars } from "../vars";
// import { VoyageContext } from "../VoyageApp";
import * as options_flat from "../../../util/options.json";

export const PivotContext = React.createContext({});

//const option_url = "/voyage/?hierarchical=false";
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const default_object = {
  groupby_fields: [pivot_row_vars[0], pivot_col_vars[1]],
  value_field_tuple: [pivot_cell_vars[0], "sum"],
  cachename: ["voyage_export"],
};

function PivotApp(props) {
  const { search_object } = useContext(props.context);
  //console.log(search_object);
  const [complete_object, set_complete_object] = useState(default_object);
  const [selected_object, set_selected_object] = useState(default_object);
  //console.log("init_selected_object= ",selected_object);
  // const [selected_object, set_selected_object] = useState({
  //   groupby_fields: [pivot_row_vars[0], pivot_col_vars[1]],
  //   value_field_tuple: [pivot_cell_vars[0], "sum"],
  //   cachename: ["voyage_export"],
  // });

  // Labels
  // const [label, setLabel] = useState();
  // const [isLoading, setLoading] = useState(true);

  // Options
  //   const [aggregation, setAgg] = React.useState("sum");
  const [option, setOption] = useState({
    0: pivot_row_vars[0],
    1: pivot_col_vars[1],
    // 2: pivot_cell_vars[0],
  });

  const [value, setValue] = useState({
    0: pivot_cell_vars[0],
    1: "sum",
    // 2: pivot_cell_vars[0],
  });

  const handleChange_agg = (event, idx) => {
    //setAgg(event.target.value);
    setValue({
      ...value,
      [idx]: event.target.value,
    });
    let tmp = selected_object["value_field_tuple"];
    tmp[idx] = event.target.value;
    set_selected_object({
      ...selected_object,
      value_field_tuple: tmp,
    });
  };

  const handleChange = (event, idx) => {
    setOption({
      ...option,
      [idx]: event.target.value,
    });
    let tmp = selected_object["groupby_fields"];
    tmp[idx] = event.target.value;
    set_selected_object({
      ...selected_object,
      groupby_fields: tmp,
    });
  };

  // Combine the filter and the default
  useEffect(() => {
    //console.log("updating");
    //console.log(selected_object);
    //console.log(search_object);
    set_complete_object(Object.assign({}, search_object, selected_object));
  }, [search_object, selected_object]);

  // if (isLoading) {
  //   return <div className="spinner"></div>;
  // }

  return (
    <div>
      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rows</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option[0]}
              label="Rows"
              name="Rows"
              onChange={(event) => {
                handleChange(event, 0);
              }}
            >
              {pivot_row_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {options_flat[option]["flatlabel"]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, my: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Columns</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option[1]}
              name="Columns"
              label="Columns"
              onChange={(event) => {
                handleChange(event, 1);
              }}
            >
              {pivot_col_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {options_flat[option]["flatlabel"]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120, my: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Cells</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value[0]}
              name="Cells"
              label="Cells"
              onChange={(event) => {
                handleChange_agg(event, 0);
              }}
            >
              {pivot_cell_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {options_flat[option]["flatlabel"]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Remove NA? (does not work)
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={true}
            //onChange={handleChange_agg}
            row
          >
            <FormControlLabel value="true" control={<Radio />} label="True" />
            <FormControlLabel
              disabled
              value="false"
              control={<Radio />}
              label="False"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Value Function
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value[1]}
            onChange={(event) => {
              handleChange_agg(event, 1);
            }}
            row
          >
            <FormControlLabel value="sum" control={<Radio />} label="Sum" />
            <FormControlLabel value="mean" control={<Radio />} label="Mean" />
            <FormControlLabel
              disabled
              control={<Radio />}
              label="Normalize_rows"
            />
            <FormControlLabel
              disabled
              control={<Radio />}
              label="Normalize_columns"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div>
        <PivotContext.Provider value={{ complete_object, set_complete_object }}>
          <Pivot context={PivotContext} />
        </PivotContext.Provider>
      </div>
    </div>
  );
}

export default PivotApp;