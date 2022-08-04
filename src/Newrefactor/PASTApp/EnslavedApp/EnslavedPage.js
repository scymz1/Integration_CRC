// import NavBar from "../../CommonComponent/NavBar";
// import { useEffect, useMemo, useState } from "react";
// import Button from "@mui/material/Button";
// import axios from "axios";
// import Table from "../../CommonComponent/Table/Table";
// import {
//   enslaved_var_list as variables_tree,
//   enslaved_default_list,
// } from "./var";
// import Cell from "../../CommonComponent/Table/Cell";
// //import { voyage_default_list } from "../../Util/tableVars";
// import ColSelector from "../../CommonComponent/ColumnSelector";
// import { enslaved_default_list, enslaved_var_list as variables_tree } from "./var";
// import * as options_flat from "./options.json";

// const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
// axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
// axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
// const endpoint = "past/enslaved/";

// export default function EnslavedPage(props) {
//   const [dataset, setDataset] = useState(0);
//   const [filter_object, set_filter_object] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [pagination, setPagination] = useState({
//     currPage: 0,
//     rowsPerPage: 10,
//     totalRows: 0,
//   });
//   const [dataList, setDataList] = useState([]);
//   const [sortModel, setSortModel] = useState([{ field: "id", sort: "asc" }]);

//   useEffect(() => {
//     //console.log("fetching...", pagination);
//     setIsLoading(true);
//     setDataList([]);
//     let selectedData = new FormData();
//     selectedData.append("hierarchical", "False");
//     selectedData.append("results_page", pagination.currPage + 1);
//     selectedData.append("results_per_page", pagination.rowsPerPage);
//     selectedData.append("dataset", dataset);
//     selectedData.append("dataset", dataset);
//     if (sortModel.length !== 0) {
//       sortModel.map((field) => {
//         if (field.sort === "asc") {
//           selectedData.append("order_by", field.field);
//         } else if (field.sort === "desc") {
//           selectedData.append("order_by", "-" + field.field);
//         }
//       });
//     }
//     axios.post("/" + endpoint, selectedData).then((res) => {
//       setPagination({
//         ...pagination,
//         totalRows: Number(res.headers.total_results_count),
//       });
//       setDataList(res.data);
//       setIsLoading(false);
//     });
//   }, [
//     pagination.currPage,
//     pagination.rowsPerPage,
//     filter_object,
//     sortModel,
//     dataset,
//   ]);

//   return (
//     <div style={{height: "100%"}}>
//       <NavBar state={{pageType: "enslaved", dataset, setDataset}}/>
//       <Table
//         state={{
//           pageType: "enslaved",
//           dataList,
//           pagination,
//           setPagination,
//           sortModel,
//           setSortModel,
//           filter_object,
//           set_filter_object,
//           isLoading,
//           checkbox: true,
//           selectedData,
//           setSelectedData,
//           default_list: enslaved_default_list,
//           variables_tree,
//           options_flat,
//         }}
//       />
//     </div>
//   );
// }
