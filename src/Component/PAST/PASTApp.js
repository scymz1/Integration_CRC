import * as React from "react";
import PAST from "./PAST";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {CircularProgress} from "@mui/material";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const PASTContext = React.createContext({});

export default function PASTApp(props) {
  const [queryData, setQueryData] = React.useState({
    targets: [500001, 500101, 501101],
    type: "slave",
  })
  const [data, setData] = useState([]);
  const [endpoint, setEndpoint] = useState((() => {
    switch (queryData.type) {
      case "slave": return "past/enslaved/"
      case "enslaver": return "past/enslavers/"
    }
  })())
  useEffect(() => {
    setEndpoint((() => {
      switch (queryData.type) {
        case "slave": return "past/enslaved/"
        case "enslaver": return "past/enslavers/"
      }
    })())
    const fetchData = async ()=> {
      const promises = queryData.targets.map(target => {
        let queryData = new FormData();
        queryData.append("id", target.toString());
        queryData.append("id", target.toString());
        return  fetch(base_url + endpoint, {
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

  const {isLoading: isLoading_tree, error: error_tree, data: options_tree} = useQuery('Option_tree',
    () => fetch(base_url + endpoint, {
      method: "OPTIONS",
      headers: {'Authorization': auth_token}
    }).then(res => res.json())
  )
  const {isLoading: isLoading_flat, error: error_flat, data: options_flat} = useQuery('Options_flat',
    () => fetch(base_url + endpoint + "?hierarchical=false", {
      method: "OPTIONS",
      headers: {'Authorization': auth_token}
    }).then(res => res.json())
  )

  const menu_label = {
    "voyage_id": "ID",
    "voyage_itinerary": "Itinerary",
    "voyage_dates": "Dates",
    "voyage_crew": "Crew",
    "voyage_ship": "Ship",
    "voyage_captainconnection": "Captain",
    "voyage_shipownerconnection": "Ship Owner",
    "voyage_outcome": "Outcome",
    "voyage_sourceconnection": "Source"
  }

  const [search_object, set_search_object] = useState({
  })

  if (error_flat) return 'An error has occurred on option flat: ' + error_flat.message
  if (error_tree) return 'An error has occurred on option tree: ' + error_tree.message
  if (isLoading_flat || isLoading_tree) return <CircularProgress/>
  return (
    <PASTContext.Provider value={{queryData, setQueryData, data, options_tree, options_flat, search_object, set_search_object, menu_label}}>
      <PAST/>
    </PASTContext.Provider>
  )
}