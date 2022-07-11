import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {PASTContext} from "../PASTApp";
<<<<<<< HEAD
// import {Graph} from "react-d3-graph";
import {Button} from "@mui/material";

=======
import {Button, CircularProgress} from "@mui/material";
import Graph from "react-graph-vis";
>>>>>>> 96a288cc1c3e10b6f49da4905a1185f040c6f8b8
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

  const [graph, setGraph] = useState(null);

  useEffect(()=>{
    let tmp = {
      nodes: [],
      edges: []
    };
    setGraph(null)
    const fetchData = async () => {
      const promises = data.map(item => {
        let formdata = new FormData();
        formdata.append("voyage__id", item.voyage.id);
        formdata.append("voyage__id", item.voyage.id);
        const endpoint = (() => {
          switch (queryData.type) {
            case "slave": return "past/enslaved/"
            case "enslaver": return "past/enslavers/"
          }
        })()
        return fetch(base_url + endpoint, {
          method: 'POST',
          headers: {'Authorization': auth_token},
          body: formdata,
        }).then(response => response.json())
      })
      const slaveOnSameVoyage = await Promise.all(promises)
      // console.log("response", response)
      data.forEach((item, index) => {
        //self
        // console.log("self", item.id)
        let existNode = tmp.nodes.find(node => node.id === item.id)
        if(existNode){
          existNode.color = "red"
          existNode.font = {size: 30}
        }else {
          tmp.nodes.push({id: item.id, label: item.documented_name, color: "red", font: {size: 30}})
        }
        //caption
        item.voyage.voyage_captainconnection.forEach((captainData)=>{
          // console.log("captain", captainData.captain.id)
          if(!tmp.nodes.find(node => node.id === captainData.captain.id)) {
            tmp.nodes.push({id: captainData.captain.id, label: captainData.captain.name, color: "orange"})
          }
          tmp.edges.push({from:item.id, to: captainData.captain.id, label: "captain", id: item.id+"_"+captainData.captain.id})
        })
        // voyage
        slaveOnSameVoyage[index].forEach((slave)=>{
          // console.log("slave", slave.id)
          if(!tmp.nodes.find(node => node.id === slave.id)) {
            tmp.nodes.push({id: slave.id, color: "blue", label: slave.documented_name})
          }
          if(item.id !== slave.id) {
            tmp.edges.push({from:item.id, to: slave.id, label: "peer", id: item.id+"_"+slave.id})
          }
        })
        //enslaver
        item.transactions.forEach((transaction)=>{
          transaction = transaction.transaction;
          transaction.enslavers.forEach((enslaver) => {
            // console.log("enslaver", enslaver.enslaver_alias.id)
            if(!tmp.nodes.find(node => node.id === enslaver.enslaver_alias.id)){
              tmp.nodes.push({id: enslaver.enslaver_alias.id, color: "green", label: enslaver.enslaver_alias.alias})
            }
            let existLink = tmp.edges.find(edges => edges.from === item.id && edges.to === enslaver.enslaver_alias.id)
            if(existLink) {
              existLink.label = existLink.label+", "+enslaver.role.role
            }else{
              tmp.edges.push({from: item.id, to: enslaver.enslaver_alias.id, label: enslaver.role.role, id:item.id+"_"+enslaver.enslaver_alias.id})
            }
          })
        })
      })
      setGraph(tmp)
      console.log("tmp", tmp)
    }
    fetchData().catch(console.error);
  }, [data])

  const events = {
    doubleClick: function(event) {
      const { nodes } = event;
      setGraph(null)
      setQueryData({
        type: "slave",
        targets: nodes
      })
    }
  };

  const options = {
    physics: {
      enabled: false
    },
    height: "300"
  };

  return (
    <div>
      <h1>NetWork</h1>
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <Button onClick={()=>console.log("graph:", graph)}>print graph</Button>
      <Button onClick={()=>console.log("graph:", queryData)}>print queryData</Button>
<<<<<<< HEAD
      {/* <Graph
        id="network" // id is mandatory, if no id is defined rd3g will throw an error
        data={graph}
        config={myConfig}
        onClickNode={handleClickNode}
      /> */}
=======
      {!graph ?
        <CircularProgress/> :
        <Graph
        graph={graph}
        options={options}
        events={events}
      />}
>>>>>>> 96a288cc1c3e10b6f49da4905a1185f040c6f8b8
    </div>
  )
}