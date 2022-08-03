import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import Table from "../../CommonComponent/Table/Table";
import * as options_flat from "./options.json";
import {enslaver_default_list, enslaver_var_list} from "./var";
import Cell from "../../CommonComponent/Table/Cell";
import NavBar from "../../CommonComponent/NavBar";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const endpoint = "past/enslavers/";

export default function EnslaverPage(props) {
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

  useEffect(() => {
    //console.log("fetching...", pagination);
    setIsLoading(true);
    setDataList([]);
    let queryData = new FormData();
    queryData.append("hierarchical", "False");
    queryData.append("results_page", pagination.currPage + 1);
    queryData.append("results_per_page", pagination.rowsPerPage);
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
  }, [pagination.currPage, pagination.rowsPerPage, filter_object, sortModel]);

  return (
    <div style={{height: "100%"}}>
      <NavBar state={{pageType: "enslaver", dataset, setDataset}}/>
      {/*<Button onClick={()=>console.log(dataList)}>Print Data</Button>*/}
      <Table
        state={{
          pageType:"enslaver",
          dataList,
          pagination,
          setPagination,
          sortModel,
          setSortModel,
          filter_object,
          set_filter_object,
          isLoading,
          default_list: enslaver_default_list,
          var_list: enslaver_var_list,
          options_flat,
        }}
      />
    </div>
  );
}