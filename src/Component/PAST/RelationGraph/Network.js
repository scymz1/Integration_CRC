import * as React from "react";
import {useContext, useEffect, useRef, useState} from "react";
import {PASTContext} from "../PASTApp";
import {Button, CircularProgress} from "@mui/material";
import Graph from "react-graph-vis";
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
  const {queryData, setQueryData, data, windowRef} = useContext(PASTContext);
  const [graph, setGraph] = useState(null);
  const [height, setHeight] = useState("300");

  function updateQueryData(path, id) {
    let formdata = new FormData();
    formdata.append(path, id);
    formdata.append(path,id);
    const endpoint = "past/enslaved/"
    fetch(base_url + endpoint, {
      method: 'POST',
      headers: {'Authorization': auth_token},
      body: formdata,
    }).then(response => response.json()).then(res => {
      const targets = []
      res.forEach((slave => {
        if(!targets.find(e => e === slave.id))
          targets.push(slave.id)
      }))
      console.log("targets", targets)
      setQueryData({
        type: "slave",
        targets: targets
      })
    })
  }

  useEffect(()=> {
    setHeight((0.7 * windowRef.current.offsetHeight).toString())
  }, [])

  useEffect(()=>{
    let tmp = {
      nodes: [],
      edges: [],
      addNode: (node, label, type, color) => {
        let existNode = tmp.nodes.find(e => e.id === node.id)
        if(existNode){
          existNode.color = color
          existNode.label = label
          existNode.type = type
          return existNode
        }else {
          let newNode = {id: node.id, label: label, color: color, type: type}
          tmp.nodes.push(newNode)
          return newNode
        }
      },
      link: (from, to, label)=>{
        let existLink = tmp.edges.find(edge => edge.id === from.id+"_"+to.id)
        if(existLink) {
          return existLink
        }else {
          let newLink = {from:from.id, to: to.id, label: label, id: from.id+"_"+to.id}
          tmp.edges.push(newLink)
          return newLink
        }
      }
    };
    setGraph(null)
    data.forEach((item, index) => {
      //self
      const self = tmp.addNode(item, item.documented_name, "slave", "red")
      self.font = {size: windowRef.current.offsetHeight*0.03}
      //transaction
      item.transactions.forEach((transaction)=>{
        const transactionData = transaction.transaction
        tmp.addNode(transactionData, `transportation: ${transactionData.id}`, "transportation", "orange")
        tmp.link(item, transactionData, `from ${transactionData.voyage.voyage_itinerary.imp_principal_place_of_slave_purchase.geo_location.name} to ${transactionData.voyage.voyage_itinerary.imp_principal_port_slave_dis.geo_location.name} at ${transactionData.voyage.voyage_dates.imp_arrival_at_port_of_dis}`)

        //caption
        transactionData.voyage.voyage_captainconnection.forEach((captainData)=>{
          const captain = captainData.captain
          tmp.addNode(captain, captain.name, "caption", "lightblue")
          tmp.link(captain, transactionData, "captain")
        })

        //enslaver
        transactionData.enslavers.forEach((enslaver) => {
          // console.log("enslaver", enslaver.enslaver_alias.id)
          tmp.addNode(enslaver.enslaver_alias, enslaver.enslaver_alias.alias, "enslaver", "green")
          tmp.link(transactionData, enslaver.enslaver_alias, enslaver.role.role)
        })
      })
    })
    const fetchData = async () => {
      const promises = data.map(item =>
        item.transactions.map((transaction)=>{
          let formdata = new FormData();
          formdata.append("transactions__transaction__id", transaction.transaction.id);
          formdata.append("transactions__transaction__id", transaction.transaction.id);
          const endpoint = "past/enslaved/"
          return fetch(base_url + endpoint, {
            method: 'POST',
            headers: {'Authorization': auth_token},
            body: formdata,
          }).then(response => response.json())
        })
      )

      const slaveOnSameVoyage = await Promise.all(promises.map((promise) => Promise.all(promise)))
      // console.log("slaveOnSameVoyage", slaveOnSameVoyage)
      data.forEach((item, dataIndex) => {
        item.transactions.forEach((transaction, transactionIndex) => {
          slaveOnSameVoyage[dataIndex][transactionIndex].forEach((slave)=>{
            // console.log("slave", slave.id)
            tmp.addNode(slave, slave.documented_name, "slave", "red")
            if(item.id !== slave.id){
              tmp.link(transaction.transaction, slave, "peer")
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
      const { nodes: nodeId } = event;
      // console.log("nodeId" ,nodeId)
      const node = graph.nodes.find(e => e.id === nodeId[0])
      switch (node.type) {
        case "slave":
          setQueryData({
            type: "slave",
            targets: nodeId
          })
          break;
        case "transportation":
          updateQueryData("transactions__transaction__id", node.id)
          break;
        case "caption":
          updateQueryData("transactions__transaction__voyage__voyage_captainconnection__captain__id", node.id);
          break;
        case "enslaver":
          updateQueryData("transactions__transaction__enslavers__enslaver_alias__id", node.id);
          break;
      }
    }
  };

  const options = {
    physics: {
      enabled: false
    },
    height: height
  };

  return (
    <div>
      <h1>Relation between: {data.map((item, index) => index === data.length-1 ? item.documented_name : item.documented_name + " & ")}</h1>
      {/*<Button onClick={()=>console.log("data:", data)}>print data</Button>*/}
      {/*<Button onClick={()=>console.log("graph:", graph)}>print graph</Button>*/}
      {/*<Button onClick={()=>console.log("graph:", queryData)}>print queryData</Button>*/}
      {!graph ?
        <CircularProgress/> :
        <Graph
        graph={graph}
        options={options}
        events={events}
      />}
    </div>
  )
}