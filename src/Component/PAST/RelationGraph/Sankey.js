import { useContext, useEffect, useState } from "react";
import { PASTContext } from "../PASTApp";
import * as React from "react";
import { Box, Button, Typography, Popover } from "@mui/material";
import { sankey, sankeyLeft, sankeyLinkHorizontal } from "d3-sankey";
import { truncate } from "lodash";
import './styles.css'
import { MODALContext } from "../PAST";

import Story from "./Story";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function Sankey(props) {
    const {data,windowRef,setOpen, setInfo, setId, modal} = useContext(PASTContext);
    const [graph, setGraph] = useState(null);
    const [CANVAS_WIDTH, setCANVAS_WIDTH] = useState(700);
    const [CANVAS_HEIGHT, setCANVAS_HEIGHT] = useState(450);
    const NODE_WIDTH = 140;
    const MIN_NODE_HEIGHT = 40;

    // const [open, setOpen] = React.useState(false);
    const handleOpen = (event, info, modal) => {
      if (modal) {
        // console.log("voyage id",info)
          setOpen(true);
          setId(info);
      // setId(info.id);
    }
  };
    // const handleClose = () => setOpen(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popOpen, setPopOpen] = React.useState(null);

    const handlePopoverOpen = (event, node) => {
        setAnchorEl(event.currentTarget);
        setPopOpen(node.id);
        // console.log("Hover Success on", node.id);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setPopOpen(null);
        // console.log("Hover Leave from node")
    };

    // const popOpen = Boolean(anchorEl);
        const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    

    useEffect(()=>{
      let new_CANVAS_WIDTH = 0.8 * windowRef.current.offsetWidth;
      let new_CANVAS_HEIGHT = 0;
      let transLength = 0;
      let enslaverLength = 0;
      let nodes = [];
      let links = [];
      for (var i = 0; i < data.length; i++) {
        nodes.push({id: data[i].id, name: data[i].documented_name, type: "enslaved"}); 
        transLength = transLength + data[i].transactions.length;
          for (var j = 0; j < data[i].transactions.length; j++) {
            var transaction_id;
            switch (data[i].transactions[j].transaction.voyage) {
              case null:
                transaction_id = data[i].transactions[j].transaction.id;
                break;
              default:
                transaction_id = data[i].transactions[j].transaction.voyage.id;
                break;
            }
            if (nodes.findIndex(x =>  
                  x.id === transaction_id &&
                  x.name === data[i].transactions[j].transaction.relation_type.relation_type &&
                  x.amount === data[i].transactions[j].transaction.amount
                ) === -1) {
                nodes.push({
                            id: transaction_id,
                            name: data[i].transactions[j].transaction.relation_type.relation_type,
                            amount: data[i].transactions[j].transaction.amount,
                            type: "transaction",
                          });
            }
            if (links.findIndex(x =>  
                x.source === nodes.findIndex(x => x.id === data[i].id) &&
                x.target === nodes.findIndex(x => x.id === transaction_id &&
                                                  x.name === data[i].transactions[j].transaction.relation_type.relation_type
                )) === -1) {
                links.push({
                            source: nodes.findIndex(x => x.id === data[i].id),
                            target: nodes.findIndex(x => x.id === transaction_id &&
                                                         x.name === data[i].transactions[j].transaction.relation_type.relation_type),
                            color: "#1e3162",
                            info: "",
                            value:5
                          })
            }
            enslaverLength = enslaverLength + data[i].transactions[j].transaction.enslavers.length;
            for (var z = 0; z < data[i].transactions[j].transaction.enslavers.length; z++) {
              if (nodes.findIndex(x => 
                  x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id
                  ) === -1) {
                  nodes.push({
                              id: data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id, 
                              name: data[i].transactions[j].transaction.enslavers[z].enslaver_alias.alias,
                              type: "enslaver"
                            });
                  }     
              if (links.findIndex(x => 
                  x.source === nodes.findIndex(x => x.id === transaction_id &&
                                                    x.name === data[i].transactions[j].transaction.relation_type.relation_type) &&
                  x.target === nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id) &&
                  x.info === data[i].transactions[j].transaction.enslavers[z].role.role
                  ) === -1) 
              {
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
                    default:
                      link_color = "#1e3162";
                      break;
                  }
                  links.push({source: nodes.findIndex(x => x.id === transaction_id &&
                                                            x.name === data[i].transactions[j].transaction.relation_type.relation_type),
                              target: nodes.findIndex(x => x.id === data[i].transactions[j].transaction.enslavers[z].enslaver_alias.id),
                              color: link_color,
                              info: data[i].transactions[j].transaction.enslavers[z].role.role,
                              value:5})
              }
            }
          }
      };
      
      new_CANVAS_HEIGHT = Math.max(data.length, transLength, enslaverLength) * MIN_NODE_HEIGHT;
      
      setCANVAS_HEIGHT(new_CANVAS_HEIGHT);
      setCANVAS_WIDTH(new_CANVAS_WIDTH);
      const tmpGraph = sankey()
        .nodeAlign(sankeyLeft)
        .nodeWidth(NODE_WIDTH)
        // .nodeheight(40)
        .extent([
          [30, 30],
          [new_CANVAS_WIDTH, new_CANVAS_HEIGHT]
        ])({nodes, links});
      
      setGraph(tmpGraph)  
    }, [data]);

  function renderStory(node) {
    // if(node.type === "enslaved")
    // console.log("hover node", data.find((slave)=> slave.id === node.id))
    // console.log("renderStory")
    switch(node.type) {
      case "enslaved": return <Story target={data.find((slave)=> slave.id === node.id)}/>
      case "transaction": return "transaction"
      case "enslaver": return "enslaver story"
      default: return ""
    }
    
  }

  return (
    <div>
      <h1>Sankey</h1>
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
              <foreignObject
                key={`sankey-node-text-${node.index}`}
                className="node"
                x={node.x0}
                y={node.y0}
                width={node.x1 - node.x0}
                height={node.y1 - node.y0}>
                <div className="node-name">
                  <Box
                    onClick={(e)=>{handlePopoverOpen(e, node)}}
                    // onMouseEnter={()=>{console.log("hover enter", node)}}
                    onMouseLeave={handlePopoverClose}
                    >
                    
                    <Typography align="center">{node.name}</Typography>
                    {/* <Typography align="center">{node.id}</Typography> */}
                    <Typography align="center">{node.voyagebutton}</Typography>
                  </Box>
                  <Popover
                    id={`sankey-node-text-${node.index}`}
                    sx={{
                      pointerEvents: 'none',
                    }}
                    open={popOpen === node.id}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    >
                    {renderStory(node)}
                  </Popover>
                </div>
              </foreignObject>
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
