import {
  DataGrid,
  GridToolbar,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { LinearProgress } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { enslaved_default_list } from "../PAST/vars";
import * as options_flat from "../util/enslaved_options.json";
import Cell from "./Cell";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { max } from "lodash";

export default function PASTTable(props) {
  const {
    dataList,
    totalRows,
    pagination,
    setPagination,
    sortModel,
    setSortModel,
    isLoading,
    set_search_object,
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
          default:
            var curlength=250
            //console.log("abdc", key, typeof(value))
            if(typeof(value)==="number"){
              curlength=value.toString().length*20;
            }
            else if(typeof(value)==="string"){
              curlength=value.length*10;
            }
            // console.log("abdc", key, curlength, typeof(temp[key])!=="undefined", temp[key])
            temp[key]=temp[key]? Math.max(temp[key], curlength):curlength;
            break;
        };
      }
    })
    enslaved_default_list.forEach((column) => {console.log(column, temp[column])})
    //console.log("temp", temp);
    return temp;
  }, [dataList]);
  const defaultColumns = useMemo(() => {
    const result = [];
    enslaved_default_list.forEach((column) => {
      result.push({
        field: column,
        headerName: options_flat[column].flatlabel,
        renderCell: Cell,
        //minWidth: 160,
        flex: lengths[column],
        minWidth: Math.max(options_flat[column].flatlabel.length*8.8, 100),
        maxWidth: 1000,
      });
      
    });
    
    return result;
  }, [enslaved_default_list, lengths]);
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

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
  //const [columns, setColumns] = useState(defaultColumns);
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight={true}
        columns={defaultColumns}
        rows={dataList}
        rowCount={totalRows}
        loading={isLoading}
        components={{
          LoadingOverlay: LinearProgress,
          Toolbar: GridToolbar,
          Pagination: CustomPagination,
        }}
        // componentsProps={{}}
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
