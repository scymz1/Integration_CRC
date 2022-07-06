import * as React from "react";
import PAST from "./PAST";
import {useEffect, useState} from "react";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const PASTContext = React.createContext({});

export default function PASTApp(props) {
  const [queryData, setQueryData] = React.useState({
    targets: [3, 5],
    type: "slave",
  })
  const [data, setData] = useState([]);

  useEffect(() => {
    const endPoint = (() => {
      switch (queryData.type) {
        case "slave": return "past/enslaved/"
        case "enslaver": return "past/enslavers/"
      }
    })()
    const fetchData = async ()=> {
      const promises = queryData.targets.map(target => {
        let queryData = new FormData();
        queryData.append("id", target.toString());
        queryData.append("id", target.toString());
        return  fetch(base_url + endPoint, {
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

  return (
    <PASTContext.Provider value={{queryData, setQueryData, data}}>
      <PAST/>
    </PASTContext.Provider>
  )
}