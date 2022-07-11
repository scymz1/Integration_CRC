import * as React from 'react';
import ColSelector from './ColSelector';
import Table from './Table';
import {VoyageContext} from "../../VoyageApp"
import Button from "@mui/material/Button";
export const ColContext = React.createContext({});

export default function(props) {
    const [cols, setCols] = React.useState([]);
    const {
        options_tree, endpoint
    } = React.useContext(props.context)

    return (
        <div>
            {/* <Button onClick={()=>console.log("options_tree:", endpoint)}>print options_tree</Button> */}
            <ColContext.Provider value={{cols, setCols, endpoint, checkbox: false, modal: true}}>
                <ColSelector context={ColContext}/>
                <Table context={ColContext}/>
            </ColContext.Provider>
        </div>
        
    )
}