import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Button, LinearProgress } from "@mui/material";
import { useMemo, useState } from "react";
import Cell from "./Cell";
import Pagination from "@mui/material/Pagination";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import * as React from "react";
import TableChartIcon from "@mui/icons-material/TableChart";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ColSelector from "./ColumnSelector";
import VoyageModal from "../VoyageModal";
import HubIcon from "@mui/icons-material/Hub";

export const TableContext = React.createContext({});

export default function Table(props) {
  const {
    pageType,
    dataList,
    pagination,
    setPagination,
    setSortModel,
    isLoading,
    //set_filter_object,
    checkbox,
    default_list,
    variables_tree,
    options_flat,
    selectedData,
    setSelectedData,
    handleDialogOpen,
  } = props.state;

  const [selectionModel, setSelectionModel] = useState([]);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const [voyageOpen, setVoyageOpen] = useState(false);
  const [voyageId, setVoyageId] = useState(0);

  const var_list = useMemo(()=>{
    let result = []
    const buildVarList = (node)=>{
      Object.keys(node).forEach((key)=>{
        if(node[key]){
          buildVarList(node[key])
        }else{
          result.push(key)
        }
      })
    }
    buildVarList(variables_tree)
    return result
  }, [variables_tree])

  // const lengths = useMemo(() => {
  //   var temp = {};
  //   dataList.forEach((row) => {
  //     for (const [key, value] of Object.entries(row)) {
  //       switch (key) {
  //         case "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias":
  //           var curlength = value ? value.length * 200 : 200;
  //           temp[key] = temp[key] ? Math.max(temp[key], curlength) : curlength;
  //           break;
  //         case "gender":
  //           temp[key] = 80;
  //         default:
  //           var curlength = 0;
  //           if (typeof value === "number") {
  //             curlength = value.toString().length * 20;
  //           } else if (typeof value === "string") {
  //             curlength = value.length * 10;
  //           }
  //           temp[key] = temp[key] ? Math.max(temp[key], curlength) : curlength;
  //           break;
  //       }
  //     }
  //   });
  //   return temp;
  // }, [dataList]);

  // const defaultColumns = useMemo(() => {
  //   const result = [];
  //   const colVisModel = {};
  //   var_list.forEach((column) => {
  //     console.log();
  //     colVisModel[column] = !!default_list.find(e => e === column);
  //     result.push({
  //       field: column,
  //       headerName: options_flat[column].flatlabel,
  //       renderCell: Cell,
  //       flex: dataList.length === 0 ? 1 : 1+Math.max(...dataList.map(e=>e[column]? e[column].toString().length: 0)),
  //       minWidth: options_flat[column].flatlabel*8,
  //       // flex: lengths[column]
  //       //   ? Math.max(
  //       //       options_flat[column].flatlabel.length * 8.8,
  //       //       lengths[column]
  //       //     )
  //       //   : options_flat[column].flatlabel.length,
  //       // minWidth: lengths[column]
  //       //   ? Math.max(
  //       //       options_flat[column].flatlabel.length * 8.8,
  //       //       lengths[column]
  //       //     )
  //       //   : options_flat[column].flatlabel.length * 8.8,
  //     });
  //   });
  //   setColumnVisibilityModel(colVisModel);
  //   return result;
  // }, [default_list, dataList]);

  const columns = useMemo(()=>{
    const result = [];
    const colVisModel = {};
    var_list.forEach((column) => {
      console.log();
      colVisModel[column] = !!default_list.find(e => e === column);
      result.push({
        field: column,
        headerName: options_flat[column].flatlabel,
        renderCell: Cell,
        minWidth: 10 * (dataList.length === 0 ? 1 : Math.max(...dataList.map(e=>e[column]? e[column].toString().length: 0), options_flat[column].flatlabel.length)),
      });
    });
    setColumnVisibilityModel(colVisModel);
    return result;
  }, [dataList])
  // const [columns, setColumns] = useState(defaultColumns);

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);
    const handleChange = (event) => {
      setPagination({ ...pagination, rowsPerPage: event.target.value });
    };

    return (
      <Stack direction="row" spacing={2}>
        <div sx={{ border: 0 }}>
          Rows Per column: &nbsp;&nbsp;
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pagination.rowsPerPage}
            label="Age"
            onChange={handleChange}
            style={{ height: 30 }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
          </Select>
        </div>
        <div>
          <Pagination
            color="primary"
            count={pageCount}
            page={page + 1}
            onChange={(event, value) => apiRef.current.setPage(value - 1)}
          />
        </div>
      </Stack>
    );
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <Stack direction={"row"} spacing={1}>
          <Button
            variant="contained"
            startIcon={<DashboardCustomizeIcon />}
            onClick={() => {}}
          >
            Gallary
          </Button>
          <Button
            startIcon={<HubIcon />}
            // variant="outlined"
            onClick={handleDialogOpen}
          >
            Connections
          </Button>
          {/*<ColSelector*/}
          {/*  state={{*/}
          {/*    cols: columns,*/}
          {/*    setCols: setColumns,*/}
          {/*    variables_tree,*/}
          {/*    options_flat,*/}
          {/*  }}*/}
          {/*/>*/}
          <GridToolbarDensitySelector />
          <GridToolbarExport />
          {pageType === "enslaver" ? (
            <Link to={"/past/enslaved"} style={{ textDecoration: "none" }}>
              <Button startIcon={<TableChartIcon />}>Enslaved</Button>
            </Link>
          ) : (
            <Link to={"/past/enslaver"} style={{ textDecoration: "none" }}>
              <Button startIcon={<TableChartIcon />}>Enslaver</Button>
            </Link>
          )}
        </Stack>
      </GridToolbarContainer>
    );
  }

  return (
    <TableContext.Provider
      value={{
        selectedData,
        setSelectedData,
        handleDialogOpen,
        setVoyageOpen,
        setVoyageId,
      }}
    >
      <div style={{ width: "100%" }}>
        <DataGrid
          autoHeight={true}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          rows={dataList}
          rowCount={pagination.totalRows}
          loading={isLoading}
          components={{
            LoadingOverlay: LinearProgress,
            Toolbar: CustomToolbar,
            Pagination: CustomPagination,
          }}
          // pagination
          pagination
          paginationMode="server"
          page={pagination.currPage}
          pageSize={pagination.rowsPerPage}
          onPageChange={(newPage) => {
            setPagination({ ...pagination, currPage: newPage });
          }}
          onPageSizeChange={(newPageSize) => {
            setPagination({ ...pagination, rowsPerPage: newPageSize });
          }}
          // sorting
          sortingMode="server"
          onSortModelChange={(newSortModel) => {
            setSortModel(newSortModel);
          }}
          // checkbox
          checkboxSelection={checkbox}
          keepNonExistentRowsSelected
          onSelectionModelChange={(newSelectionModel) => {
            if (newSelectionModel.length <= 10) {
              // set the maximum number of the selected people
              setSelectionModel(newSelectionModel);
              setSelectedData({
                ...selectedData,
                type: pageType,
                [pageType]: newSelectionModel,
              });
            }
          }}
          selectionModel={selectionModel}
          style={{ zIndex: 0 }}
        />
        {voyageOpen && (
          <VoyageModal info={{ voyageOpen, setVoyageOpen, voyageId }} />
        )}
      </div>
    </TableContext.Provider>
  );
}
