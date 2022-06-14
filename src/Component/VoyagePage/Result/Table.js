import React, { useState, useEffect, useContext } from "react";
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
import { GlobalContext } from "../../App";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const option_url = "/voyage/" + "?hierarchical=false"; // labels in dropdowns
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Table() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const { search_object, options_flat } = useContext(GlobalContext);

  const total_results_count = 5816;
  const [page, setPage] = useState(2);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  
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
        console.log(response.headers);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div>
        <Box sx={{ minWidth: 120, my: 2 }}>
          <FormControl fullWidth>
            <TablePagination
              component="div"
              count={total_results_count}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer component={Paper}>
              <Tables sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {search_object.selected_fields.map((v) => (
                      <TableCell style={{ color: "#389c90" }}>{options_flat[v].flatlabel}</TableCell>
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
            <Stack
              spacing={2}
              margin={2}
              direction="row"
              justifyContent="flex-end"
            >
              <Pagination count={10} />
            </Stack>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}

export default Table;
