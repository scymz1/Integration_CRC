import React, { useState, useEffect } from "react";
import axios from "axios";
// import Plot from "react-plotly.js";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FormControlLabel, RadioGroup } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import { pivot_row_vars, pivot_col_vars, pivot_cell_vars } from "./vars";
// import { VoyageContext } from "../VoyageApp";
import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const option_url = "/voyage/?hierarchical=false"; // labels in dropdowns

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Pivot() {
  // const { search_object } = React.useContext(VoyageContext);
  const search_object = {
    voyage_itinerary__imp_principal_region_slave_dis__region: [
      "Barbados",
      "Jamaica",
    ],
  };

  // Labels
  const [label, setLabel] = useState();
  const [isLoading, setLoading] = useState(true);

  // Responses
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);

  // Options
  const [aggregation, setAgg] = React.useState("sum");
  const [option, setOption] = useState({
    row: pivot_row_vars[0],
    col: pivot_col_vars[1],
    cell: pivot_cell_vars[0],
  });

  const handleChange_agg = (event) => {
    setAgg(event.target.value);
  };

  const handleChange = (event, name) => {
    setOption({
      ...option,
      [name]: event.target.value,
    });
  };

  // Set rows
  useEffect(() => {
    var data = new FormData();
    data.append("hierarchical", "False");
    for (var property in search_object) {
      // eslint-disable-next-line no-loop-func
      search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }
    data.append("groupby_fields", option.col);
    data.append("groupby_fields", option.row);
    data.append("value_field_tuple", option.cell);
    data.append("value_field_tuple", aggregation);
    data.append("cachename", "voyage_export");
    axios
      .post("/voyage/crosstabs", data)
      .then(function (response) {
        //console.log("-----set rows-----");
        //console.log(response.data);
        const row_name = Object.keys(response.data);
        const rows = Object.values(response.data);
        for (var i = 0; i < rows.length; i++) {
          rows[i][""] = row_name[i];
        }
        setRows(rows);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.row, option.col, option.cell, aggregation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set columns
  useEffect(() => {
    var data = new FormData();
    data.append("hierarchical", "False");
    for (var property in search_object) {
      // eslint-disable-next-line no-loop-func
      search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }
    data.append("groupby_fields", option.row);
    data.append("groupby_fields", option.col);
    data.append("value_field_tuple", option.cell);
    data.append("value_field_tuple", aggregation);
    data.append("cachename", "voyage_export");
    axios
      .post("/voyage/crosstabs", data)
      .then(function (response) {
        //console.log("-----set columns-----");
        const empty = [""];
        //console.log(empty.concat(Object.keys(response.data)));
        setCols(empty.concat(Object.keys(response.data)));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.row, option.col, option.cell, aggregation]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get labels
  useEffect(() => {
    axios
      .options(option_url)
      .then(function (response) {
        //console.log("labels = ", response.data);
        setLabel(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  return (
    <div>
      <div>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rows</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={option.row}
              label="Rows"
              name="Rows"
              onChange={(event) => {
                handleChange(event, "row");
              }}
            >
              {pivot_row_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {label[option]["flatlabel"]}
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
              value={option.col}
              name="Columns"
              label="Columns"
              onChange={(event) => {
                handleChange(event, "col");
              }}
            >
              {pivot_col_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {label[option]["flatlabel"]}
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
              value={option.cell}
              name="Cells"
              label="Cells"
              onChange={(event) => {
                handleChange(event, "cell");
              }}
            >
              {pivot_cell_vars.map((option) => (
                <MenuItem key={option} value={option}>
                  {label[option]["flatlabel"]}
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
            value={aggregation}
            onChange={handleChange_agg}
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
        {/* <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 500,
            }}
          ></Paper>
        </Grid> */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f2f2f2" }}>
                {cols.map((col) => (
                  <TableCell>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {cols.map((s) => {
                    if (typeof row[s] === "number") {
                      return <TableCell>{Math.round(row[s])}</TableCell>;
                    } else {
                      return <TableCell>{row[s] || 0}</TableCell>;
                    }
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Pivot;
