import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {PASTContext} from "../PASTApp";
// import {Graph} from "react-d3-graph";
import {Button} from "@mui/material";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

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

  const [graph, setGraph] = useState({
    nodes: [],
    links: []
  });

  const getSlaveOnVoyage = async (voyageId, slaveOnVoyage) => {
    let formdata = new FormData();
    formdata.append("voyage__id", voyageId);
    formdata.append("voyage__id", voyageId);

    const endpoint = (() => {
      switch (queryData.type) {
        case "slave": return "past/enslaved/"
        case "enslaver": return "past/enslavers/"
      }
    })()
    return await fetch(base_url + endpoint, {
      method: 'POST',
      headers: {'Authorization': auth_token},
      body: formdata,
    }).then(response => response.json())
      .then(response => slaveOnVoyage = response)
  }

  useEffect(()=>{
    let tmp = {
      nodes: [],
      links: []
    };
    data.forEach((item) => {
      // let slaveOnVoyage = {}
      // getSlaveOnVoyage(item.voyage.id, slaveOnVoyage).catch(console.error)
      // console.log(slaveOnVoyage)
      item.transactions.forEach((transaction)=>{
        transaction = transaction.transaction;
        transaction.enslavers.forEach((enslaver) => {
          tmp = {...tmp,
            nodes: [...tmp.nodes,
              {id: enslaver.enslaver_alias.alias, color: "green", size: 300},
            ],
            links: [...tmp.links,
              {source: item.documented_name, target: enslaver.enslaver_alias.alias, label: enslaver.role.role},
            ]
          }
        })
      })
      tmp = {
        nodes: [...tmp.nodes,
          {id: item.documented_name, color: "red", size: 600, nodeId: item.id},
          {id: item.voyage.voyage_captainconnection[0].captain.name, color: "blue", size: 300},
        ],
        links: [...tmp.links,
          {source: item.documented_name, target: item.voyage.voyage_captainconnection[0].captain.name, label: "captain"},
        ]
      }
    })
    setGraph(tmp)
    console.log("tmp", tmp)
  }, [data])


  // const graph = {
  //   nodes: [
  //     { id: "Harry", color: "red", size: 600},
  //     { id: "Sally" },
  //     { id: "Alice" }
  //   ],
  //   links: [
  //     { source: "Harry", target: "Sally" },
  //     { source: "Harry", target: "Alice" }
  //   ]
  // };

// the graph configuration, you only need to pass down properties
// that you want to override, otherwise default ones will be used
  const myConfig = {
    directed: true,
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
      // viewGenerator: ()=>(
      //   <svg style={{width: "100%", height: "100%"}}>
      //     <rect  x="20%" y="30%" width="60%" height="40%" rx="10%" ry="10%" stroke="black" fill="transparent" stroke-width="1"/>
      //   </svg>
      // ),
    },
    link: {
      type: "CURVE_SMOOTH",
      highlightColor: "lightblue",
      renderLabel: true,
    },
    width: 600,
    height: 400
  };

  function handleClickNode(nodeId, node){
    setQueryData(
      {
        type: "slave",
        targets: [node.nodeId]
      }
    )
  }

  return (
    <div>
      <h1>NetWork</h1>
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <Button onClick={()=>console.log("graph:", graph)}>print graph</Button>
      <Button onClick={()=>console.log("graph:", queryData)}>print queryData</Button>
      {/* <Graph
        id="network" // id is mandatory, if no id is defined rd3g will throw an error
        data={graph}
        config={myConfig}
        onClickNode={handleClickNode}
      /> */}
    </div>
  )
}