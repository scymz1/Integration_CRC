import Filter from "./Filter";
import Result from "./Result";
import {useState} from "react";

// Wrapper.js is used to combine the Filter with Result


export default function Datastore() {
    const [data, setData] = useState({
        name: ['name1', 'name2']
    })

 
    return (
        <div>
            {/* Optional call to get Label (flattern and hierachical labels) which will transimit to filter && result*/}

            {/* Option Query*/}


            {/* Filter */}
            <Filter setData={setData} data={data}/>

            {/* Result */}
            <Result data={data}/>
        </div>
    )
}