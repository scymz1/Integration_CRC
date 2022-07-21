import * as React from "react";
import PAST from "./PAST";
import {useEffect, useState, useRef} from "react";
import {useQuery} from "react-query";
import {CircularProgress} from "@mui/material";
import * as enslaved_options_flat from "../util/enslaved_options.json"
import * as enslaver_options_flat from "../util/enslaver_options.json"
import { enslaver_var_list } from "./vars";
import { enslaved_var_list } from "./vars";
// import { columnOptions } from '../VoyagePage/Result/Table/tableVars';
// import * as options_flat from '../util/options.json'
const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const PASTContext = React.createContext({});

export default function PASTApp(props) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [info, setInfo] = useState([]);
  const [typeForTable, setTypeForTable] = useState("slaves");
  const [dataSet, setDataSet] = useState("1")
  const [queryData, setQueryData] = React.useState({
    slaves: [],
    type: "slaves",
    enslavers:[]
  })

  const windowRef = useRef(null);

  const [data, setData] = useState([]);

  const getEndpoint = (typeForTable) => {
    switch (typeForTable) {
      case "slaves": return "past/enslaved/"
      case "enslavers": return "past/enslavers/"
    }
  }

  // const options_flat = () => {
  //   switch (typeForTable){
  //     case "slaves": return enslaved_options_flat
  //     case "enslavers": return enslaver_options_flat
  //   }
  // }
  const options_flat = typeForTable === "slaves" ? enslaved_options_flat : enslaver_options_flat;
  const nested_tree = typeForTable === "slaves" ? enslaved_var_list : enslaver_var_list;
  // const nested_tree = () => {
  //   switch (typeForTable) {
  //     case "slaves": return enslaved_var_list
  //     case "enslavers": return enslaver_var_list
  //   }
  // }

  useEffect(() => {
    const endpoint = (getEndpoint(queryData.type))
    const targets = (() => {
      switch (queryData.type) {
        case "slaves": return queryData.slaves
        case "enslavers": return queryData.enslavers
      }
    })()
    const fetchData = async ()=> {
      const promises = targets.map(target => {
        let queryData = new FormData();
        queryData.append("id", target.toString());
        queryData.append("id", target.toString());
        return fetch(base_url + endpoint, {
          method: "POST",
          body: queryData,
          headers: {'Authorization': auth_token}
        }).then(res => res.json()).then(res => res[0])
      })
      const response = await Promise.all(promises)
      setData(response)
    }
    fetchData().catch(console.error);
  }, [queryData])

  const [search_object, set_search_object] = useState({
    'dataset':["1", "1"]
  })
  const [labels, setLabels] = React.useState([]);

  const [chipData, setChipData] = React.useState({});
  // if (error_flat) return 'An error has occurred on option flat: ' + error_flat.message
  // if (error_tree) return 'An error has occurred on option tree: ' + error_tree.message
  // if (isLoading_flat || isLoading_tree) return <CircularProgress/>
  return (
    <PASTContext.Provider value={{
      queryData, setQueryData, data,
      nested_tree, options_flat, search_object, set_search_object,
      windowRef, typeForTable, setTypeForTable,
      modal: false, id, setId, open, setOpen, info, setInfo, chipData, setChipData,
      dataSet, setDataSet, labels, setLabels, page: "past"
    }}>
      <PAST/>
    </PASTContext.Provider>
  )
}