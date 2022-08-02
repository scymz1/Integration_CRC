import * as React from "react";
import {useEffect, useState, useRef} from "react";
import * as enslaved_options_flat from "./options.json"
import { enslaved_var_list } from "./vars";

// const auth_token = process.env.REACT_APP_AUTHTOKEN
// const base_url = process.env.REACT_APP_BASEURL;

// export default function EnslavedPage(props) {
//     const [open, setOpen] = useState(false);
//     const [id, setId] = useState(0);
//     const [info, setInfo] = useState([]);
//     const [typeForTable, setTypeForTable] = useState("slaves");
//     const [dataSet, setDataSet] = useState("1")
//     const [queryData, setQueryData] = React.useState({
//         slaves: [],
//         type: "slaves",
//     })
//     const [data, setData] = useState([]);
//     const [drawerOpen, setDrawerOpen] = React.useState(false);
//     // const options_flat = enslaved_options_flat;
//     // const nested_tree = enslaved_var_list;
//     // const [search_object, set_search_object] = useState({
//     //     'dataset':["1", "1"]
//     //   })
//     // const [labels, setLabels] = React.useState([]);
//     // const [chipData, setChipData] = React.useState({});
//     // // if (error_flat) return 'An error has occurred on option flat: ' + error_flat.message
//     // // if (error_tree) return 'An error has occurred on option tree: ' + error_tree.message
//     // // if (isLoading_flat || isLoading_tree) return <CircularProgress/>

//     // const [totalResultsCount, setTotalResultsCount] = useState(0);
//     // const [page, setPage] = useState(0);
//     // const [rowsPerPage, setRowsPerPage] = useState(10);

//     // const [sortingReq, setSortingReq] = useState(false);
//     // const [field, setField] = useState([]);
//     // const [direction, setDirection] = useState("asc");
    
//     // const handleDrawerOpen = () => {
//     //   setDrawerOpen(!drawerOpen);
//     // };
//     // const handleDrawerClose = () => {
//     //     setDrawerOpen(!drawerOpen);
//     // };

//     useEffect(() => {
//         const targets = queryData.slaves
//         const fetchData = async ()=> {
//           const promises = targets.map(target => {
//             let queryData = new FormData();
//             queryData.append("id", target.toString());
//             queryData.append("id", target.toString());
//             return fetch(base_url + 'past/enslaved/', {
//               method: "POST",
//               body: queryData,
//               headers: {'Authorization': auth_token}
//             }).then(res => res.json()).then(res => res[0])
//           })
//           const response = await Promise.all(promises)
//           setData(response)
//         }
//         fetchData().catch(console.error);
//       }, [queryData])


// }