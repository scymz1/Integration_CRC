import Voyage from "./VoyagePage/Voyage";
import {useQuery} from "react-query";
import React from 'react';
import {useState} from "react";

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
        name: ["value1", "value2"]
    })

    if(error_flat) return 'An error has occurred on option flat: ' + error_flat.message
    if(error_tree) return 'An error has occurred on option tree: ' + error_tree.message
    if(isLoading_flat || isLoading_tree) return "Is Loading..."

    return (
        <GlobalContext.Provider value={{options_tree, options_flat, search_object, set_search_object}}>
            <Voyage />
        </GlobalContext.Provider>
    )
}