import React, { useState, useEffect, useContext, useReducer } from "react";
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
import { VoyageContext } from "../../VoyageApp";
import TablePagination from "@mui/material/TablePagination";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Button from "@mui/material/Button";
import { idxRelation, skeleton } from "../vars";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { ColContext } from "./TableApp";

const option_url = "/voyage/?hierarchical=false";
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const initialState = [true, true, true, true, true, true, true];

function reducer(state, { type, index }) {
  switch (type) {
    case "expand-all":
      return [true, true, true, true, true, true, true];
    case "collapse-all":
      return [false, false, false, false, false, false, false];
    case "toggle":
      return [...state, (state[index] = !state[index])];
    default:
      throw new Error();
  }
}

function Table() {
  const [isLoading, setLoading] = useState(true);
  const [value, setValue] = useState([]);
  const { search_object, options_flat } = useContext(VoyageContext);

  //menu
  const {cols} = useContext(ColContext)

  // Label
  const [label, setLabel] = useState();

  // Pagination
  const [totalResultsCount, setTotalResultsCount] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortingReq, setSortingReq] = useState(false);
  const [field, setField] = useState([]);
  const [direction, setDirection] = useState("asc");

  // Modal
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState([]);
  const [id, setId] = useState(1);
  const [content, setContent] = useState([]);
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "scroll",
    maxHeight: 500,
  };

  // Expand/Collapse
  const [isExpanded, setIsExpanded] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Get the labels
  useEffect(() => {
    axios
      .options(option_url)
      .then(function (response) {
        //console.log(response.data);
        setLabel(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

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

    cols.forEach((v) => {
      // console.log(v)
      data.append("selected_fields", v); 
  }); 

    axios
      .post("/voyage/", data)
      .then(function (response) {
        setValue(Object.values(response.data));
        //console.log(response.headers.total_results_count);
        setTotalResultsCount(Number(response.headers.total_results_count));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [page, rowsPerPage, sortingReq, field, direction, cols]); // eslint-disable-line react-hooks/exhaustive-deps

  // Modal
  useEffect(() => {
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("voyage_id", id);
    data.append("voyage_id", id);

    // for (var i = 0; i < modalVars.length; i++) {
    //   data.append("selected_fields", modalVars[i]);
    // }

    axios
      .post("/voyage/", data)
      .then(function (response) {
        //console.log(response.data);
        //console.log(Object.keys(response.data));
        //console.log(Object.values(response.data));
        setContent(Object.values(response.data)[Object.keys(response.data)]);
        //console.log("here=",Object.values(response.data)[Object.keys(response.data)].voyage_id)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [id]);

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
    setOpen(true);
    setInfo(info);
    setId(info.id);
  };

  const handleClose = () => setOpen(false);

  const handleAllExpansion = () => {
    if (isExpanded) {
      dispatch({ type: "collapse-all" });
    } else {
      dispatch({ type: "expand-all" });
    }
    setIsExpanded(!isExpanded);
  };

  const handleSingleExpansion = (event, title) => {
    dispatch({ type: "toggle", index: idxRelation[title] });
  };

  if (isLoading) {
    return <div className="spinner"></div>;
  }

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
                  {value.map((row) => (
                    // <TableRow>
                    <StyledTableRow
                      key={row.name}
                      onClick={(event) => handleOpen(event, row)}
                    >
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
              <Pagination
                count={Math.ceil(totalResultsCount / rowsPerPage)}
                page={page + 1}
                onChange={handleChangePagePagination}
              />
            </Stack>
          </FormControl>
        </Box>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            sx={{ fontWeight: "bold" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            <div>
              Full detail: {info.id}
              <IconButton
                sx={{ float: "right" }}
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </Typography>
          <Typography>
            <div>
              Here are the currently available details for this voyage.
              <Button onClick={handleAllExpansion}>Expand/Collapse</Button>
              to see/hide all.
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {Object.keys(skeleton).map((title) => (
              <div>
                <Accordion
                  expanded={state[idxRelation[title]]}
                  // onClick={(event) => handleSingleExpansion(event, title)}
                  sx={{ margin: "5px" }}
                >
                  <AccordionSummary sx={{ backgroundColor: "#f2f2f2" }}
                  onClick={(event) => handleSingleExpansion(event, title)}>
                    <Typography sx={{ fontWeight: "bold" }}>{title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {skeleton[title].map((obj) => (
                        <Grid container spacing={2} columns={16}>
                          <Grid sx={{ fontWeight: "bold" }} item xs={8}>
                            {label[obj].flatlabel}
                          </Grid>
                          <Grid item xs={8}>
                            {content[obj]}
                          </Grid>
                        </Grid>
                      ))}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            ))}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Table;
