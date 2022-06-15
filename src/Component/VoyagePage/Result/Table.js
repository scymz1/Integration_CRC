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
import { styled } from '@mui/material/styles';

const option_url = "/voyage/" + "?hierarchical=false"; // labels in dropdowns
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Table() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const { search_object, options_flat } = useContext(GlobalContext);

  const total_results_count = 5816;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event, newRowsPerPage) => {
  //   setRowsPerPage(newRowsPerPage);
  // };

  useEffect(() => {
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("results_page", page+1);
    data.append("results_per_page", rowsPerPage);


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
  // }, [handleChangePage, handleChangeRowsPerPage]);
  }, [page, rowsPerPage]);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));



  if (isLoading) {
    return <div className="spinner"></div>;
  }

  const handleChangePage = (event, newPage) => {
    console.log("newpage", newPage)
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    console.log("newRowsperpage", event.target.value)
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleChangePagePagination = (event, newPage) => {
    console.log("newPagePagi", newPage)
    setPage(newPage - 1)
  }
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
                    // <TableRow>
                    <StyledTableRow key={row.name}>
                      {Object.values(row).map((k) => (
                        <TableCell>{k}</TableCell>
                      ))}
                     {/* </TableRow> */}
                    </StyledTableRow>
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
              <Pagination count={Math.ceil(total_results_count/rowsPerPage) } page={page+1} onChange={handleChangePagePagination}/>
            </Stack>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}

export default Table;
