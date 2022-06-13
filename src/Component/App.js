import Voyage from "./VoyagePage/Voyage";
import {QueryClient, useQuery} from "react-query";
import React from 'react';
import {useState} from "react";
import ResponsiveAppBar from "./NavBar";
import Home from "./HomePage/home"
import {BrowserRouter, Route, Routes} from "react-router-dom"
import OptionSelector from "./VoyagePage/util/optionSelector";
import {CircularProgress} from "@mui/material";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const GlobalContext = React.createContext({});

export default function App() {
    const { isLoading: isLoading_tree, error: error_tree, data: options_tree } = useQuery('repoData',
        () => fetch(base_url + "voyage/", {
            method: "OPTIONS",
            headers: {'Authorization': auth_token}
        }).then(res => res.json())
    )
    const { isLoading: isLoading_flat, error: error_flat, data: options_flat } = useQuery('repoData',
        () => fetch(base_url + "voyage/", {
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


        // agg_fn: ["sum"],

        // cachename: ["voyage_bar_and_donut_charts"]

        voyage_itinerary__imp_principal_region_slave_dis__geo_location__name: [
        "Barbados",
        "Jamaica",
        ],
        results_page: ["1"],
        results_per_page: ["3"],
        selected_fields: [
            "id",
            "voyage_itinerary",
            "voyage_slaves_numbers__imp_total_num_slaves_embarked",
            "voyage_itinerary__first_landing_region__geo_location__name",
            "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name",
        ],
    })

    if(error_flat) return 'An error has occurred on option flat: ' + error_flat.message
    if(error_tree) return 'An error has occurred on option tree: ' + error_tree.message
    if(isLoading_flat || isLoading_tree) return <CircularProgress />

    return (
        <GlobalContext.Provider value={{options_tree, options_flat, search_object, set_search_object}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Voyage />}/>
                    <Route path="voyage/optionSelector" element={<OptionSelector/>}/>
                    {/* <Home /> */}
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}