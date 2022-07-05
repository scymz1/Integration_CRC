import {useContext, useState} from "react";
import {PASTContext} from "../PASTApp";
import {useQuery} from "react-query";
import {Button, CircularProgress} from "@mui/material";
import * as React from "react";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function Story (props) {
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //Story做为比Sankey，Network更小一级的component，和Sankey，Network的数据不同步,
  //调用时使用： <Story target={[target_id1, target_id2]} type="your type"/>
  const {target, type} = props;
  const endPoint = (() => {
    switch (type) {
      case "slave": return "past/enslaved/"
      case "enslaver": return "past/enslavers/"
    }
  })()
  const {isLoading, error, data} = useQuery('data',
    () => {
      let queryData = new FormData();
      queryData.append("id", target);
      queryData.append("id", target);
      return fetch(base_url + endPoint, {
        method: "POST",
        body: queryData,
        headers: {'Authorization': auth_token}
      }).then(res => res.json())
    }
  )

  if (error) return 'An error has occurred: ' + error.message
  if (isLoading) return <CircularProgress/>
  return (
    <div>
      <h1>Text</h1>
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
    </div>
  )
}