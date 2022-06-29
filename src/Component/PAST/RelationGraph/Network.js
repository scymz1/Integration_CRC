import {useContext} from "react";
import {PASTContext} from "../PASTApp";
import * as React from "react";
import { Graph } from "react-d3-graph";
import {Button} from "@mui/material";

export default function Network(props) {
  //data: 根据queryData请求到的data，是一个list. 点击print data按钮可以在console中打印出data
  //queryData & setQueryData: queryData有两个field: targets和type,
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //把targets和type包起来是为了保证targets和type同步更新，以免出现target和type不匹配而产生error.
  //使用setQueryData()来更新queryData，queryData改变后会自动重新fetch来更新data.
  //queryData更新方法示例：
  // setQueryData({
  //   ...queryData,
  //   type: "newType",
  //   targets: [...queryData.targets, "newTarget"]
  // })
  const {queryData, setQueryData, data} = useContext(PASTContext);

  const testData = {
    nodes: [
      { id: "Harry", color: "red", size: 600},
      { id: "Sally" },
      { id: "Alice" }
    ],
    links: [
      { source: "Harry", target: "Sally" },
      { source: "Harry", target: "Alice" }
    ]
  };

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
  const myConfig = {
    nodeHighlightBehavior: true,
    d3: {
      gravity: -100,
      linkLength: 100,
      alphaTarget: 0.05,
      linkStrength: 1,
    },
    node: {
      color: "lightgreen",
      size: 320,
      labelProperty: 'id',
      highlightStrokeColor: "blue",
      labelPosition: "center",
      viewGenerator: ()=>(
        <svg style={{width: "100%", height: "100%"}}>
          <rect  x="20%" y="30%" width="60%" height="40%" rx="10%" ry="10%" stroke="black" fill="transparent" stroke-width="1"/>
        </svg>
      ),
    },
    link: {
      type: "CURVE_SMOOTH",
      highlightColor: "lightblue"
    },
    width: 300,
    height: 300
  };

  return (
    <div>
      <h1>NetWork</h1>
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
        <Graph
          id="network" // id is mandatory, if no id is defined rd3g will throw an error
          data={testData}
          config={myConfig}
        />
    </div>
  )
}