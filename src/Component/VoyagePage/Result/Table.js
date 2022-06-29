import React, { useState, useEffect, useContext, createContext } from "react";
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
import { VoyageContext } from "../VoyageApp";
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

//const option_url = "/voyage/" + "?hierarchical=false"; // labels in dropdowns
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

export const ModalContext = createContext();

function Table() {
  const [isLoading, setLoading] = useState(false);
  const [value, setValue] = useState([]);
  const { search_object, options_flat } = useContext(VoyageContext);

  // Pagination
  const [totalResultsCount, setTotalResultsCount] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting
  const [sortingReq, setSortingReq] = useState(false);
  const [field, setField] = useState([]);
  const [direction, setDirection] = useState("asc");

  // Modal
  const [open, setOpen] = React.useState(false);
  const [info, setInfo] = useState([]);
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Expand/Collapse
  const [expanded, setExpanded] = React.useState(false);

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
      .post("/voyage/", data)
      .then(function (response) {
        setValue(Object.values(response.data));
        //console.log(response.headers.total_results_count);
        setTotalResultsCount(Number(response.headers.total_results_count));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [page, rowsPerPage, sortingReq, field, direction]);

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
    console.log(info.id);
    console.log(info);
    setOpen(true);
    setInfo(info);
  };

  const handleClose = () => setOpen(false);

  const handleChange = () => {
    setExpanded(expanded ? false : true);
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
                    {search_object.selected_fields.map((v) => (
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Full detail: {info.id}
            <div>
              Here are the currently available details for this voyage.
              <Button onClick={handleChange}>Expand/Collapse</Button>to see/hide
              all.
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div>
              <Accordion expanded={expanded}>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Ship nation owner</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Hey, this is owner.</Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion expanded={expanded}>
                <AccordionSummary
                  // expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography>Outcome</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>Hey, this is outcome.</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

export default Table;
