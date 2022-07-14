import React, { useState, useEffect, useContext } from "react";
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
//import { VoyageContext } from "../../VoyageApp";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import Checkbox from "@mui/material/Checkbox";
//import * as options_flat from "../../../util/options.json";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Table(props) {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  //const { search_object } = useContext(VoyageContext);

  // Menu
  const { cols, endpoint, checkbox, setOpen, setInfo, setId, modal, options_flat, queryData, setQueryData,
  search_object, chipData, setChipData } =
    useContext(props.context);

  // Pagination
  const [totalResultsCount, setTotalResultsCount] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortingReq, setSortingReq] = useState(false);
  const [field, setField] = useState([]);
  const [direction, setDirection] = useState("asc");

  useEffect(() => {
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("results_page", page + 1);
    data.append("results_per_page", rowsPerPage);

    if (sortingReq) {
      var modified_field = direction === "asc" ? field : "-" + field;
      data.append("order_by", modified_field);
    }

    for (var property in search_object) {
      // eslint-disable-next-line no-loop-func
      search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }

    axios
      .post("/" + endpoint, data)
      .then(function (response) {
        //console.log(response.data);
        setValue(Object.values(response.data));
        //console.log(response.headers.total_results_count);
        setTotalResultsCount(Number(response.headers.total_results_count));
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [page, rowsPerPage, sortingReq, field, direction, search_object]); // eslint-disable-line react-hooks/exhaustive-deps

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    "&:hover": {
      backgroundColor: "#389c90",
    },
  }));

  if (isLoading) {
    return <div className="spinner"></div>;
  }

  const handleChangePage = (event, newPage) => {
    //console.log("newpage", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    //console.log("newRowsperpage", event.target.value);
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleChangePagePagination = (event, newPage) => {
    //console.log("newPagePagi", newPage);
    setPage(newPage - 1);
  };

  const handleSorting = (event, field) => {
    setField(field);
    setSortingReq(true);
    setDirection(direction === "asc" ? "desc" : "asc");
  };

  const handleOpen = (event, info) => {
    //console.log(info.id);
    if (modal) {
      setOpen(true);
      setInfo(info);
      setId(info.id);
    } else {
      //console.log(info.documented_name);
      let selected = queryData["targets"];
      const selectedIndex = selected.indexOf(info.id);
      let newSelected = [];
      let newChipData = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, info.id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setQueryData({...queryData, targets: newSelected});
    }
  };

  const isSelected = (name) => {
    if (checkbox) {
      //console.log(queryData["targets"]);
      return queryData["targets"].indexOf(name) !== -1;
    }
    return false;
  };



  return (
    <div>
      <div>
        <Box sx={{ minWidth: 120, my: 2 }}>
          <FormControl fullWidth>
            <TablePagination
              component="div"
              count={totalResultsCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <TableContainer component={Paper}>
              <Tables sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    {checkbox && (
                      <TableCell padding="checkbox">
                        {/* <Checkbox
                        color="primary"
                      /> */}
                      </TableCell>
                    )}
                    {cols.map((v) => (
                      <TableCell
                        style={{ color: "#389c90" }}
                        onClick={(event) => handleSorting(event, v)}
                      >
                        <div>{options_flat[v].flatlabel}</div>
                        <div style={{ float: "right" }}>
                          {/* position: 'flex', bottom:0 */}
                          <TableSortLabel
                            style={{ opacity: field === v ? 1 : 0.4 }}
                            active={true}
                            direction={field === v ? direction : "asc"}
                          ></TableSortLabel>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {value.map((row) => {
                    const isItemSelected = isSelected(row.id);
                    return (

                    // <TableRow>
                    <StyledTableRow
                      key={row.name}
                      onClick={(event) => handleOpen(event, row)}
                      //selected={isItemSelected}
                    >
                      {checkbox && (
                        <TableCell padding="checkbox">
                          <Checkbox color="primary" checked={isItemSelected}/>
                        </TableCell>
                      )}
                      {cols.map((k) => (
                        <TableCell>{row[k]}</TableCell>
                      ))}
                      {/* </TableRow> */}
                    </StyledTableRow>)
}
                  )}
                </TableBody>
              </Tables>
            </TableContainer>
            <Stack
              spacing={2}
              margin={2}
              direction="row"
              justifyContent="flex-end"
            >
              <Pagination
                count={Math.ceil(totalResultsCount / rowsPerPage)}
                page={page + 1}
                onChange={handleChangePagePagination}
              />
            </Stack>
          </FormControl>
        </Box>
      </div>
    </div>
  );
}

export default Table;
