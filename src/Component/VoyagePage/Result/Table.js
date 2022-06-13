import React, { useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Tables from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { GlobalContext } from '../../App';

const option_url = "/voyage/" + "?hierarchical=false"; // labels in dropdowns
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Table() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const {
    search_object,
  } = React.useContext(GlobalContext);

  // const search_object = {
  //   voyage_itinerary__imp_principal_region_slave_dis__geo_location__name: [
  //     "Barbados",
  //     "Jamaica",
  //   ],
  //   results_page: ["1"],
  //   results_per_page: ["3"],
  //   selected_fields: [
  //     "id",
  //     "voyage_itinerary",
  //     "voyage_slaves_numbers__imp_total_num_slaves_embarked",
  //     "voyage_itinerary__first_landing_region__geo_location__name",
  //     "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name",
  //   ],
  // };

  const var_names = {
    id: "id",
    voyage_itinerary: "voyage_itinerary",
    voyage_slaves_numbers__imp_total_num_slaves_embarked:
      "total_num_slaves_embarked",
    voyage_itinerary__first_landing_region__geo_location__name:
      "first_landing_region",
    voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name:
      "broad_region_voyage_begin",
  };

  useEffect(() => {
    var data = new FormData();
    data.append("hierarchical", "False");

    for (var property in search_object) {
      search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }

    axios
      .post("/voyage/", (data = data))
      .then(function (response) {
        setValue(Object.values(response.data));
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
        <Box sx={{ minWidth: 120, my: 2 }}>
          <FormControl fullWidth>
            <TableContainer component={Paper}>
              <Tables sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {search_object.selected_fields.map((v) => (
                      <TableCell>{var_names[v]}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {value.map((row) => (
                    <TableRow>
                      {Object.values(row).map((k) => (
                        <TableCell>{k}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Tables>
            </TableContainer>
          </FormControl>
        </Box>
      </div>
      <div>
        <FormControl></FormControl>
      </div>
    </div>
  );
}

export default Table;
