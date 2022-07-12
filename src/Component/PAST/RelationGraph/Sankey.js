import {useContext, useEffect, useState} from "react";
import {PASTContext} from "../PASTApp";
import * as React from "react";
import {Button} from "@mui/material";
import { sankey, sankeyLeft, sankeyLinkHorizontal } from "d3-sankey";
import { truncate } from "lodash";
import './styles.css'

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function Sankey(props) {
    const {data,windowRef} = useContext(PASTContext);
    const [graph, setGraph] = useState(null);
    const [CANVAS_WIDTH, setCANVAS_WIDTH] = useState(700);
    const [CANVAS_HEIGHT, setCANVAS_HEIGHT] = useState(450);
    const NODE_WIDTH = 140;
    const MIN_NODE_HEIGHT = 20;
    const MIN_SPACE_BETWEEN_NODES_VERTICAL = 20;


    useEffect(()=>{
      let new_CANVAS_WIDTH = 0.8*windowRef.current.offsetWidth;
      let new_CANVAS_HEIGHT = data.length * 100;
      let nodes = [];
      let links = [];
      for (var i = 0; i < data.length; i++) {
        nodes.push({id: data[i].id, name: data[i].documented_name});
    
          for (var j = 0; j < data[i].transactions.length; j++) {
            if (nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id) === -1) {
                nodes.push({id: data[i].transactions[j].transaction.id, 
                            name: data[i].transactions[j].transaction.relation_type.relation_type});
            }
            if (links.findIndex(x => x.source === nodes.findIndex(x => x.id === data[i].id) &&
                                    x.target === nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id)) === -1) {
                links.push({source: nodes.findIndex(x => x.id === data[i].id),
                            target: nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id),
                            color: "#1e3162",
                            info: "",
                            value:5})
            }
              for (var z = 0; z < data[i].transactions[j].transaction.enslavers.length; z++) {
                if (nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id) === -1) {
                  nodes.push({id: data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id, 
                                name: data[i].transactions[j].transaction.enslavers[z].enslaver_alias.alias});
                }
                
                if (links.findIndex(x => x.source === nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id) &&
                                        x.target === nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id)) === -1) {
                    var link_color;
                    switch (data[i].transactions[j].transaction.enslavers[z].role.id) {
                      case 1:
                        link_color = "#53d4b6";
                        break;
                      case 2:
                        link_color = "#e89a4d";
                        break;
                      case 3:
                        link_color = "#7a8fa1";
                        break;
                      case 4:
                        link_color = "#d188c2";
                        break;
                      case 5:
                        link_color = "#a2e66e";
                        break;
                      case 6:
                        link_color = "#1aa6d9";
                        break;
                      case 7:
                      link_color = "#fcda14";
                      break;
                    }
                    links.push({source: nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id),
                                target: nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id),
                                color: link_color,
                                info: data[i].transactions[j].transaction.enslavers[z].role.role,
                                value:5})
                }
              }
          }
      };

      nodes.forEach((node)=>{
        const result = [];
        for (var i = 0; i < Object.keys(node).length; i++) {
          result.push(
            <tr>
              <th>{Object.keys(node)[i]}</th>
              <td>{Object.values(node)[i]}</td>
            </tr>
          );
        }
        node.information = result;
        // console.log(node.id,result)
      })
      
      setCANVAS_HEIGHT(new_CANVAS_HEIGHT);
      setCANVAS_WIDTH(new_CANVAS_WIDTH);
      const tmpGraph = sankey()
        .nodeAlign(sankeyLeft)
        .nodeWidth(NODE_WIDTH)
        .extent([
          [30, 30],
          [new_CANVAS_WIDTH, new_CANVAS_HEIGHT]
        ])({nodes, links});
      
      setGraph(tmpGraph)  
    }, [data]);

    
    

  return (
    <div>
      {/* <h1>Sankey</h1> */}
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <Button onClick={()=>console.log("nodes:", graph.nodes)}>print nodes</Button>
      <Button onClick={()=>console.log("links:", graph.links)}>print links</Button>
      <Button onClick={()=>console.log("graph:", graph)}>print graph</Button>
      <br/>
      {graph?
        <svg 
        className="canvas"
        width={CANVAS_WIDTH+30}
        height={CANVAS_HEIGHT+30}
        >
        {graph.nodes.map((node) => {
          return(
            <>
              <foreignObject
                key={`sankey-node-text-${node.index}`}
                className="node"
                x={node.x0}
                y={node.y0}
                width={node.x1 - node.x0}
                height={node.y1 - node.y0}>
                <div className="node-heading">
                  <table>
                    {node.information}
                  </table>
                </div>
              </foreignObject>
            </>
        )})}
        {graph.links.map((link) => {
          return(
            <g>
              <path
                id={`sankey-link-${link.index}`}
                key={`sankey-link-${link.index}`}
                className="link"
                d={sankeyLinkHorizontal()(link)}
                fill="none"
                stroke={link.color}
                opacity="0.5"
                strokeWidth="5"/>
              <text fontSize = "15" fill={link.color} fontWeight="bold" fontFamily="arial">
                <textPath href = {`#sankey-link-${link.index}`} 
                          startOffset="50%" 
                          textAnchor="middle">
                    {link.info}
                </textPath>
              </text>
            </g>
          )
          })}
      </svg>
    :null}
    </div>
  )
}
