import React, { useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormControlLabel, RadioGroup } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { bar_x_vars, bar_y_vars } from "./vars";
import { Grid, Paper } from "@mui/material";
import * as options_flat from "../../util/options.json";
import { useWindowSize } from "@react-hook/window-size";

// import MultipleSelectChip from './MultipleSelectChip';
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

export default function Bar(props) {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name, plot_value, theme) {
    return {
      fontWeight:
        plot_value.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
// chip is used to change the box shape during each tiem we add information
// plot 
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [width, height] = useWindowSize();
  const { search_object, endpoint } = React.useContext(props.context);

  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);


  const [chips, setchips] = useState([bar_y_vars[1]]);

  const [option, setOption] = useState({
    field: bar_x_vars[0],
    value: bar_y_vars[1],
  });
  
  const [barData, setBarData] = useState([]);

  const [aggregation, setAgg] = React.useState("sum");

  // console.log("🏀", barData)

  const handleChange_agg = (event) => {
    setAgg(event.target.value);
  };

  const handleChange_x = (event, name) => {
    // console.log("🏈", event.target.value)
  setOption({
    ...option,
    [name]: event.target.value,
  });
}

  const handleChange_y = (event, name) => {
    //   console.log("🏈", event.target.value)
    setOption({
      ...option,
      [name]: event.target.value[event.target.value.length - 1],
    });
  };

  const handleChange_chips = (event) => {
    //   console.log("⚽️", "Chips changed")
    const {
        target: { value },
      } = event;
      
      setchips(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
  }


  useEffect(() => {
    // console.log("🎾", option)
    setIsLoading(true);
    // console.log("🎾",option)
    //var group_by = option.field
    var value = option.value;
    //var agg = aggregation

    var data = new FormData();
    data.append("hierarchical", "False");

    for (var property in search_object) {
      //console.log("p",property)
      //console.log('so', search_object[property])
      // eslint-disable-next-line no-loop-func
      search_object[property].forEach((v) => {
        data.append(property, v);
        // console.log("v", v);
      });
    }

    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("agg_fn", aggregation);
    data.append("cachename", "voyage_export");
    axios
      .post(endpoint + "groupby", (data = data))
      .then(function (response) {
        console.log("response", response)
        setarrx(Object.keys(response.data[value]));
        // console.log("🚌",plot_value)
        setarry(Object.values(response.data[value]));
        // console.log("💩",plot_value)

        setBarData([
          ...barData,
          {
            x: Object.keys(response.data[value]),
            y: Object.values(response.data[value]),
            type: "bar",
            name: `${options_flat[option.value].flatlabel}`,
            barmode: "group",
          },
        ]);
        setIsLoading(false)
      })
      .catch(function (error) {
        console.log(error);
      });

    

    // console.log("😭",barData)
  }, [option.field, option.value, aggregation, search_object]);

  if(isLoading) return;

  return (
    <div>
      <div>
        <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">X Field</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.field}
              label="X Field"
              onChange={(event) => {
                handleChange_x(event, "field");
              }}
              name="field"
            >
              {bar_x_vars.map((option) => (
                <MenuItem value={option} key={option}>
                  {options_flat[option].flatlabel}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ maxWidth: width > 500 ? width * 0.9 : width * 0.7, my: 2 }}>
          {/* <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Y Field</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.value}
              label="Y Field"
              name="value"
              onChange={(event) => {
                handleChange(event, "value");
              }}
            >
              {bar_y_vars.map((option) => (
                <MenuItem value={option} key={option}>
                  {options_flat[option].flatlabel}
                </MenuItem>
              ))}

            </Select>
          </FormControl> */}

          {/* Multi-Selector */}
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-chip-label">
                Multi-Selector Y-Feild
              </InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={chips}
                onChange={(event) => {
                    handleChange_chips(event);
                    handleChange_y(event, "value");
                  }}
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                        // console.log("🤔", value)
                      <Chip key={value} label= {options_flat[value].flatlabel} />
                    //   <Chip key={value} label= {options_flat[value]} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {bar_y_vars.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={getStyles(option, plot_value, theme)}
                  >
                      {/* the flatlabel */}
                     {options_flat[option].flatlabel}

                     {/* merely the label */}
                     {/* {option} */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </Box>
      </div>
      <div>
        <FormControl>
          <FormLabel id="demo-controlled-radio-buttons-group">
            Aggregation Function
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={aggregation}
            onChange={handleChange_agg}
            row
          >
            <FormControlLabel value="sum" control={<Radio />} label="Sum" />
            <FormControlLabel
              value="mean"
              control={<Radio />}
              label="Average"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div>
        <Grid>
          <Plot
            data={barData}
            layout={{
              width: width * 0.8,
              title: `The ${aggregation} of ${
                options_flat[option.field].flatlabel
              } vs <br> ${options_flat[option.value].flatlabel} Bar Graph`,
              xaxis: {
                title: { text: `${options_flat[option.field].flatlabel}` },
                fixedrange: true,
              },
              yaxis: {
                // title:
                // {text:`${options_flat[option.value].flatlabel}`},
                fixedrange: true,
              },
            }}
            config={{ responsive: true }}
          />
        </Grid>
      </div>
    </div>
  );
}



