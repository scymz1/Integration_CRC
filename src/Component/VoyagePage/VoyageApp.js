import * as React from 'react';
import {useState} from 'react';
import {CircularProgress} from "@mui/material";
import {useQuery} from "react-query";
import Voyage from "./Voyage";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const VoyageContext = React.createContext({});

export default function VoyageApp() {
  const {isLoading: isLoading_tree, error: error_tree, data: options_tree} = useQuery('Option_tree',
    () => fetch(base_url + "voyage/", {
      method: "OPTIONS",
      headers: {'Authorization': auth_token}
    }).then(res => res.json())
  )
  const {isLoading: isLoading_flat, error: error_flat, data: options_flat} = useQuery('Options_flat',
    () => fetch(base_url + "voyage/?hierarchical=false", {
      method: "OPTIONS",
      headers: {'Authorization': auth_token}
    }).then(res => res.json())
  )


  const [search_object, set_search_object] = useState({
    //test data
    // name: ["value1", "value2"]
    //test data
    // 'voyage_dates__imp_arrival_at_port_of_dis_yyyy':[1800,1810],

    // "voyage_itinerary__imp_principal_region_slave_dis__geo_location__name":[
    //     "Barbados",
    //     "Jamaica"
    // ],

    // groupby_fields: ["voyage_itinerary__imp_broad_region_slave_dis__geo_location__name",
    // "voyage_slaves_numbers__imp_total_num_slaves_disembarked"],

//[{option: "voyage_slaves_numbers__imp_total_num_slaves_disembarked", type:jjjj}, {option: "voyage_itinerary__imp_principal_region_slave_dis__geo_location__name", type:jjjj}]
    // agg_fn: ["sum"],

    // cachename: ["voyage_bar_and_donut_charts"]
    // voyage_itinerary__imp_principal_region_slave_dis__geo_location__name: [
    //     "Barbados",
    //     "Jamaica",
    //   ],
    //   results_page: ["1"],
    //   results_per_page: ["10"],
    //   selected_fields: [
    //     "id",
    //     "voyage_itinerary",
    //     "voyage_slaves_numbers__imp_total_num_slaves_embarked",
    //     "voyage_itinerary__first_landing_region__geo_location__name",
    //     "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name",
    //   ]
  })

  if (error_flat) return 'An error has occurred on option flat: ' + error_flat.message
  if (error_tree) return 'An error has occurred on option tree: ' + error_tree.message
  if (isLoading_flat || isLoading_tree) return <CircularProgress/>

  return (
    <VoyageContext.Provider value={{
      options_tree, options_flat, search_object, set_search_object}}>
      <Voyage/>
    </VoyageContext.Provider>
  );
}
