import NavBar from "../../CommonComponent/NavBar";
import { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import axios from "axios";
import Table from "../../CommonComponent/Table/Table";
import {enslaved_var_list as variables_tree, enslaved_default_list } from "./var";
import * as options_flat from "./options.json";
import Cell from "../../CommonComponent/Table/Cell";
//import { voyage_default_list } from "../../Util/tableVars";
import ColSelector from '../../CommonComponent/ColumnSelector'
import {columnOptions} from "../../Util/tableVars"
import Filter from "../../CommonComponent/Filter/Filter"

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const endpoint = "past/enslaved/";

export default function EnslavedPage(props) {
  const [dataset, setDataset] = useState(0);
  const [filter_object, set_filter_object] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currPage: 0,
    rowsPerPage: 10,
    totalRows:0,
  });
  const [dataList, setDataList] = useState([]);
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  // const {variables_tree, options_flat, dataset, filter_object} = props.state;
  const [cols, setCols] = useState(enslaved_default_list);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const state = {dataset, setDataset, drawerOpen, setDrawerOpen, pageType: "enslaved"};
  const state2 = {filter_obj: filter_object, set_filter_obj: set_filter_object, dataset, setDataset, drawerOpen, setDrawerOpen, pageType: "enslaved", options_flat, variables_tree}
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
    cols.forEach((column) => {console.log(column, temp[column])})
    //console.log("temp", temp);
    return temp;
  }, [dataList]);
  const defaultColumns = useMemo(() => {
    const result = [];
    cols.forEach((column) => {
      result.push({
        field: column,
        headerName: options_flat[column].flatlabel,
        renderCell: Cell,
        //minWidth: 160,
        //flex: 1,
        //flex: lengths[column],
        minWidth: lengths[column]?Math.max(options_flat[column].flatlabel.length*8.8, lengths[column]):options_flat[column].flatlabel.length*8.8, //options_flat[column].flatlabel.length*8.8, 100),
        maxWidth: 1000,
      });
    });
    return result;
  }, [cols, lengths]);

  useEffect(() => {
    //console.log("fetching...", pagination);
    setIsLoading(true);
    setDataList([]);
    let queryData = new FormData();
    queryData.append("hierarchical", "False");
    queryData.append("results_page", pagination.currPage + 1);
    queryData.append("results_per_page", pagination.rowsPerPage);
    queryData.append("dataset", dataset);
    queryData.append("dataset", dataset);
    if (sortModel.length !== 0) {
      sortModel.map((field) => {
        if (field.sort === "asc") {
          queryData.append("order_by", field.field);
        } else if (field.sort === "desc") {
          queryData.append("order_by", "-" + field.field);
        }
      });
    }
    axios.post("/" + endpoint, queryData).then((res) => {
      setPagination({...pagination, totalRows: Number(res.headers.total_results_count)});
      setDataList(res.data);
      setIsLoading(false);
    });
  }, [pagination.currPage, pagination.rowsPerPage, filter_object, sortModel, dataset]);

  return (
    <div style={{height: "100%"}}>
      {/* <ColSelector state={{ cols, setCols, variables_tree, options_flat}}/> */}
      <NavBar state={state}/>
      <Filter state={state2}/>
      {/*<Button onClick={()=>console.log(dataList)}>Print Data</Button>*/}
      <Table
        state={{
          pageType:"enslaved",
          dataList,
          pagination,
          setPagination,
          sortModel,
          setSortModel,
          filter_object,
          set_filter_object,
          isLoading,
          defaultColumns,
        }}
      />
    </div>
  );
}
