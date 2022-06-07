import Filter from "./Filter";
import Result from "./Result";
import {useState} from "react";

export default function Wraper() {
    const [data, setData] = useState({
        name: ['name1', 'name2']
    })
    return (
        <div>
            <Filter setData={setData} data={data}/>
            <Result data={data}/>
        </div>
    )
}