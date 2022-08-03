import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector, GridToolbarContainer, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarExport,
} from "@mui/x-data-grid";
import {Button, LinearProgress} from "@mui/material";
import { useMemo, useState } from "react";
import Cell from "./Cell";
import Pagination from "@mui/material/Pagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import {Link} from "react-router-dom";
import * as React from "react";
import TableChartIcon from '@mui/icons-material/TableChart';
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import ColSelector from "./ColumnSelector";

export default function Table(props) {
  const {
    pageType,
    enableSelect,
    dataList,
    pagination,
    setPagination,
    sortModel,
    setSortModel,
    isLoading,
    set_filter_object,
    default_list,
    variables_tree,
    options_flat,
  } = props.state;

  const lengths = useMemo(()=>{
    var temp={};
    dataList.forEach((row)=>{
      for (const [key, value] of Object.entries(row)) {
        switch(key){
          case "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias":
            var curlength=value?value.length*200:200;
            temp[key]=temp[key]?Math.max(temp[key], curlength):curlength;
            break;
          case "gender":
            temp[key]=80;
          default:
            var curlength=0
            if(typeof(value)==="number"){
              curlength=value.toString().length*20;
            }
            else if(typeof(value)==="string"){
              curlength=value.length*10;
            }
            temp[key]=temp[key]? Math.max(temp[key], curlength):curlength;
            break;
        };
      }
    })
    return temp;
  }, [dataList]);
  const defaultColumns = useMemo(() => {
    const result = [];
    default_list.forEach((column) => {
      result.push({
        field: column,
        headerName: options_flat[column].flatlabel,
        renderCell: (props) => Cell({...props}),
        flex: lengths[column]?Math.max(options_flat[column].flatlabel.length*8.8, lengths[column]):options_flat[column].flatlabel.length,
        minWidth: lengths[column]?Math.max(options_flat[column].flatlabel.length*8.8, lengths[column]):options_flat[column].flatlabel.length*8.8,
      });
    });
    return result;
  }, [default_list]);
  const [columns, setColumns] = useState(defaultColumns);

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

        <Button variant="contained" startIcon={<DashboardCustomizeIcon />} onClick={()=>{}}>
          Gallary
        </Button>
        <ColSelector state={{cols: columns, setCols: setColumns, variables_tree, options_flat}}/>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        {pageType === "enslaver"?
          <Link to={"/past/enslaved"} style={{ textDecoration: "none" }}>
            <Button startIcon={<TableChartIcon/>}>Enslaved</Button>
          </Link>:
          <Link to={"/past/enslaver"} style={{ textDecoration: "none" }}>
            <Button startIcon={<TableChartIcon/>}>Enslaver</Button>
          </Link>
        }
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight={true}
        columns={columns}
        rows={dataList}
        rowCount={pagination.totalRows}
        loading={isLoading}
        components={{
          LoadingOverlay: LinearProgress,
          Toolbar: CustomToolbar,
          Pagination: CustomPagination,
        }}
        pagination
        paginationMode="server"
        // rowsPerPageOptions={[10, 20, 50]}
        page={pagination.currPage}
        pageSize={pagination.rowsPerPage}
        onPageChange={(newPage) => {
          setPagination({ ...pagination, currPage: newPage });
        }}
        onPageSizeChange={(newPageSize) => {
          setPagination({ ...pagination, rowsPerPage: newPageSize });
        }}
        sortingMode="server" //sortModel={sortModel}
        onSortModelChange={(newSortModel) => {
          setSortModel(newSortModel);
        }}
      />
    </div>
  );
}
