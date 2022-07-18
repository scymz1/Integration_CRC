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
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
//import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

function Table(props) {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  //const { search_object } = useContext(VoyageContext);

  // Menu
  const {
    cols,
    endpoint,
    checkbox,
    setOpen,
    setInfo,
    setId,
    modal,
    options_flat,
    queryData,
    setQueryData,
    search_object,
    chipData,
  } = useContext(props.context);


  // Pagination
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortingReq, setSortingReq] = useState(false);
  const [field, setField] = useState([]);
  const [direction, setDirection] = useState("asc");

  // Checkbox
  //const [checkedMax, setCheckedMax] = useState(false);

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
    } else if (info.transactions.length !== 0) {
      //setOpen(true);
      // setInfo(info);
      //console.log(info.transactions__transaction__voyage__id[0]);
      //setId(info.transactions__transaction__voyage__id[0]);
      //console.log(info.documented_name);
      //let selected = queryData["targets"];
      const selectedIndex = queryData["targets"].indexOf(info.id);
      if (selectedIndex === -1) {
        if (!checkedMax(info.id)) {
          chipData[info.id] = info.documented_name;
        }
      } else {
        delete chipData[info.id];
      }
      setQueryData({
        ...queryData,
        targets: Object.keys(chipData).map(Number),
      });
    }
  };

  const handleCellOpen = (event, info) => {
    setOpen(true);
    setId(info.transactions__transaction__voyage__id[0]);
  };

  const isSelected = (name) => {
    if (checkbox) {
      //console.log(queryData["targets"]);
      return queryData["targets"].indexOf(name) !== -1;
    }
    return false;
  };

  const checkedMax = (value) => {
    const maxAllowed = 10;
    //console.log(value);
    const checked = queryData["targets"];
    return checked.length >= maxAllowed && checked.indexOf(value) === -1;
  };

  const createPopover = (row) => {
    const people =
      row[
        "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
      ];
    const roles = row["transactions__transaction__enslavers__role__role"];
    //console.log(people, roles);
    const output = {};
    for (let i = 0; i < people.length; i++) {
      if (people[i] in output === false) {
        output[people[i]] = [];
      }
      output[people[i]].push(roles[i][0]);
    }
    //console.log(output);
    return output;
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
                    {cols.map((v, key) => (
                      <TableCell
                        style={{ color: "#389c90" }}
                        onClick={(event) => handleSorting(event, v)}
                        key={'title-' + key}
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
                        key={row.id}
                        onClick={(event) => handleOpen(event, row)}
                        //selected={isItemSelected}
                      >
                        {checkbox && row.transactions.length !== 0 && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              disabled={checkedMax(row.id)}
                            />
                          </TableCell>
                        )}
                        {checkbox && row.transactions.length === 0 && (
                          <TableCell padding="checkbox"></TableCell>
                        )}
                        {cols.map((k, key) => {
                          if (k === "gender") {
                            if (row[k] === 1) {
                              return <TableCell key={'content-' + key}>Male</TableCell>;
                            } else if (row[k] === 2) {
                              return <TableCell key={'content-' + key}>Female</TableCell>;
                            } else {
                              return <TableCell key={'content-' + key}>{row[k]}</TableCell>;
                            }
                          } else if (
                            k ===
                            "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
                          ) {
                            const popover = createPopover(row);
                            //console.log(popover);
                            return (
                              <TableCell key={'content-' + key}>
                                <Stack direction="row" spacing={1}>
                                  {Object.keys(popover).map((name, key) => (
                                    <Tooltip
                                      key={'tooltip-' + key}
                                      arrow
                                      title={popover[name].join(", ")}
                                      placement="top"
                                    >
                                      <Chip label={name} />
                                    </Tooltip>
                                  ))}
                                </Stack>
                              </TableCell>
                            );
                          } else if (
                            k === "transactions__transaction__voyage__id"
                          ) {
                            return (
                              <TableCell key={'content-' + key}>
                                <Link
                                  component="button"
                                  variant="body2"
                                  onClick={(e) => {
                                    handleCellOpen(e, row);
                                    // e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: [...new Set(row[k])].join(", "),
                                    }}
                                  />
                                </Link>
                              </TableCell>
                            );
                          } else if (typeof row[k] === "object") {
                            return (
                              <TableCell key={'content-' + key}>
                                <div // [...new Set(row[k])]
                                  dangerouslySetInnerHTML={{
                                    __html: [...new Set(row[k])].join(", "),
                                  }}
                                />
                                {/* {[...new Set(row[k])].join(", ")} */}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={'content-' + key}>
                                <div // [...new Set(row[k])]
                                  dangerouslySetInnerHTML={{ __html: row[k] }}
                                />
                              </TableCell>
                            );
                          }
                        })}
                      </StyledTableRow>
                    );
                  })}
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
