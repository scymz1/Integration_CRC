import NavBar from "../../CommonComponent/NavBar";
import { useEffect, useMemo, useState } from "react";
// import Button from "@mui/material/Button";
import axios from "axios";
import Table from "../../CommonComponent/Table/Table";
import * as options_flat from "./options.json";
import {
  enslaved_var_list as variables_tree,
  enslaved_default_list,
} from "./var";
import Filter from "../../CommonComponent/Filter/Filter";
import Button from "@mui/material/Button";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
const endpoint = "past/enslaved/";

export default function EnslavedPage(props) {
  const [dataset, setDataset] = useState(1);
  const [filter_object, set_filter_object] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cols, setCols] = useState(enslaved_default_list);
  // data response
  const [dataList, setDataList] = useState([]);
  // pagination
  const [pagination, setPagination] = useState({
    currPage: 0,
    rowsPerPage: 10,
    totalRows: 0,
  });
  // sorting
  const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);
  // sankey modal
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState({
    slaves: [],
    type: "slaves",
    enslavers: [],
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const state = {
    dataset,
    setDataset,
    drawerOpen,
    setDrawerOpen,
    pageType: "enslaved",
  };
  const state2 = {
    filter_obj: filter_object,
    set_filter_obj: set_filter_object,
    dataset,
    setDataset,
    drawerOpen,
    setDrawerOpen,
    pageType: "enslaved",
    options_flat,
    variables_tree,
  };

  // view connections & click popover & click number_slaved
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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
      sortModel.map((field) =>
        field.sort === "asc"
          ? queryData.append("order_by", field.field)
          : queryData.append("order_by", "-" + field.field)
      );
    }
    for (const property in filter_object) {
      filter_object[property].forEach((v) => {
        queryData.append(property, v);
      });
    }
    axios.post("/" + endpoint, queryData).then((res) => {
      setPagination({
        ...pagination,
        totalRows: Number(res.headers.total_results_count),
      });
      setDataList(res.data);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.currPage,
    pagination.rowsPerPage,
    filter_object,
    sortModel,
    dataset,
  ]);

  return (
    <div style={{ height: "100%" }}>
      <NavBar state={state} />
      <Filter state={state2} />
      <Button onClick={() => console.log(selectedData)}>
        {" "}
        Show Selected People
      </Button>
      <Table
        state={{
          pageType: "enslaved",
          dataList,
          isLoading,
          checkbox: true,
          default_list: enslaved_default_list,
          variables_tree,
          options_flat,
          // pagination
          pagination,
          setPagination,
          // sorting
          sortModel,
          setSortModel,
          // filter object
          filter_object,
          set_filter_object,
          // selected ids
          selectedData,
          setSelectedData,
          setDialogOpen,
          handleDialogOpen,
        }}
      />
    </div>
  );
}
