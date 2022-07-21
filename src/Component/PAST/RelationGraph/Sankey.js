import { useContext, useEffect, useState } from "react";
import { PASTContext } from "../PASTApp";
import * as React from "react";
import { Box, Button, Typography, Popover, Card, Grid, CircularProgress} from "@mui/material";
import { sankey, sankeyLeft, sankeyLinkHorizontal } from "d3-sankey";
import EastIcon from '@mui/icons-material/East';
import './styles.css'
import { MODALContext } from "../PAST";
import _ from 'lodash';

import Story from "./Story";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export default function Sankey(props) {
    const {data,windowRef,setOpen, setInfo, setId, modal, queryData} = useContext(PASTContext);
    const [graph, setGraph] = useState(null);
    const [CANVAS_WIDTH, setCANVAS_WIDTH] = useState(700);
    const [CANVAS_HEIGHT, setCANVAS_HEIGHT] = useState(450);
    const NODE_WIDTH = 140;
    const MIN_NODE_HEIGHT = 80;

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

    
    const [anchorElclick, setAnchorElclick] = React.useState(null);
    const [popOpenclick, setPopOpenclick] = React.useState(null);
    const handleClick = (event,node) => {
      setAnchorElclick(event.currentTarget);
      setPopOpenclick(node.id)
    };
    const handleClose = () => {
      setAnchorElclick(null);
      setPopOpenclick(null)
    };
    // const openclick = Boolean(anchorElclick);
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
      console.log("sankey", queryData, data)
      if(queryData.type === "enslavers") {
        setGraph("enslavers")
        return;
      }

      let new_CANVAS_WIDTH = 0.8 * windowRef.current.offsetWidth;
      let new_CANVAS_HEIGHT = 0;
      let transLength = 0;
      let enslaverLength = 0;
      let nodes = [];
      let links = [];
      for (var i = 0; i < data.length; i++) {
        nodes.push({id: data[i].id, name: data[i].documented_name, age:data[i].age,height:data[i].height,type: "enslaved"}); 
        transLength = transLength + data[i].transactions.length;
          for (var j = 0; j < data[i].transactions.length; j++) {
            var transaction_id;
            var voyage_id;
            switch (data[i].transactions[j].transaction.voyage) {
              case null:
                transaction_id = data[i].transactions[j].transaction.id;
                // place_name = data[i].transactions[j].transaction.place.geo_location.name;
                voyage_id = null;

                break;
              default:
                transaction_id = data[i].transactions[j].transaction.voyage.id;
                voyage_id = transaction_id;
               
                break;
            }
            if (nodes.findIndex(x =>  
                  x.id === transaction_id &&
                  x.name === data[i].transactions[j].transaction.relation_type.relation_type &&
                  x.amount === data[i].transactions[j].transaction.amount &&
                  x.voyage_id === voyage_id
                ) === -1) {
                 
                nodes.push({
                            id: transaction_id,      
                            voyage_id: voyage_id,      
                            name: _.get(data[i].transactions[j],["transaction","relation_type","relation_type"],null),
                            amount: _.get(data[i].transactions[j],["transaction","amount"],null),
                            place: _.get(data[i].transactions[j],["transaction","place","geo_location","name"],null),
                            full_ref: _.get(data[i].transactions[j],["transaction","source","full_ref"],null),
                            place_purchase:  _.get(data[i].transactions[j],["transaction","voyage","voyage_itinerary","imp_principal_place_of_slave_purchase","geo_location","name"],null),
                            place_dis: _.get(data[i].transactions[j],["transaction","voyage","voyage_itinerary","imp_principal_port_slave_dis","geo_location","name"],null),
                            date: _.get(data[i].transactions[j],["transaction","date"],null),
                            year: _.get(data[i].transactions[j],["transaction","voyage","voyage_dates","imp_arrival_at_port_of_dis_yyyy"],null),
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

      nodes.forEach((node)=>{
        const result = [];
        var voyagemodal = true;
        if(node.type==="enslaved"){
          result.push(
            <tbody>
            <tr>
              <th>Age: </th>
              <td>{node.age}</td>
            </tr>
            <tr>
              <th>Height: </th>
              <td>{node.height}</td>
            </tr>
            </tbody>)
        }
        if(node.type==="transaction"){
          if(node.voyage_id===null){
            voyagemodal = false;
            result.push(
              <tbody>
              <tr>
                <th>Type: </th>
                <td>{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</td>
              </tr>
              <tr>
                <th>Amount: </th>
                <td>{node.amount}</td>
              </tr>
              <tr>
                <th>Source: </th>
                <td>{node.full_ref}</td>
              </tr>
              <tr>
                <th>Place: </th>
                <td>{node.place}</td>
              </tr>
              <tr>
                <th>Date: </th>
                <td>{node.date}</td>
              </tr>
              </tbody>
            );
          }
          else{
            // console.log(node.voyage_id)
            node.voyagebutton = <Button size="small" onClick={(event) => handleOpen(event,node.voyage_id,voyagemodal)}>Voyage id:{node.voyage_id}</Button>
            // console.log(node.voyage_id) 
            result.push(
              <tbody>
              <tr>
                <th>Type: </th>
                <td>{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</td>
              </tr>
                <tr>
                <th>Place: </th>
                <td><Grid container direction="row" alignItems="center">{node.place_purchase}<EastIcon fontSize="small"/>{node.place_dis}</Grid></td>
              </tr>
              <tr>
                <th>Year: </th>
                <td>{node.year}</td>
              </tr>
              </tbody>
            );
          }
          }
        
        
        node.information = result;
        // console.log(node.id,node.information)
      })
      
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
      case "enslaved": return <Card sx={{ flexGrow: 1,  width: 400}}><Story target={data.find((slave)=> slave.id === node.id)}/></Card>
      case "transaction": return "TRANSACTION"
      case "enslaver": return "ENSLAVER"
      default: return ""
    }
    
  }

  var enslaved = []
  data.forEach((each)=>{
    enslaved.push(each.documented_name+" ")
  } )
  return (
    <div>
      <h1>Connections for {enslaved}</h1>
      {/* <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <Button onClick={()=>console.log("nodes:", graph.nodes)}>print nodes</Button>
      <Button onClick={()=>console.log("links:", graph.links)}>print links</Button>
      <Button onClick={()=>console.log("graph:", graph)}>print graph</Button> */}
      <br/>
      {!graph ?
        <CircularProgress/> :

        graph === "enslavers"? "this is enslavers" :

        <svg 
        className="canvas"
        width={CANVAS_WIDTH+30}
        height={CANVAS_HEIGHT+30}
        >
            {graph.nodes.map((node) => {
              return(
                <>
                  <rect
                    key={`sankey-node-${node.index}`}
                    x={node.x0}
                    y={node.y0}
                    width={node.x1 - node.x0}
                    height={node.y1 - node.y0}
                    fill="white" />
                  <foreignObject
                    key={`sankey-node-text-${node.index}`}
                    className="node"
                    x={node.x0}
                    y={node.y0}
                    width={node.x1 - node.x0}
                    height={node.y1 - node.y0}
                    >
                    <div className="node-name">
                      <Box
                        onClick={(e)=>{handleClick(e, node)}}
                        // onMouseEnter={()=>{console.log("hover enter", node)}}
                        onMouseEnter={(e)=>{handlePopoverOpen(e, node)}}
                        onMouseLeave={handlePopoverClose}
                        >
                        {/* {console.log(node.name,typeof(node.name))} */}
                        <Typography align="center">{node.name.charAt(0).toUpperCase() + node.name.slice(1)}</Typography>
                        {/* <Typography align="center">{node.id}</Typography> */}
                        <Typography align="center">{node.voyagebutton}</Typography>
                      </Box>
                      <Popover
                        // id={`sankey-node-text-${node.index}`}
                        open={popOpenclick === node.id && node.type==="enslaved" }
                        anchorEl={anchorElclick}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left"
                        }}
                        onClose={handleClose}
                        >
                        {renderStory(node)}
                      </Popover>
                      <Popover
                        id={`sankey-node-text-${node.index}`}
                        sx={{
                          pointerEvents: 'none',
                        }}
                        open={popOpen === node.id && node.type!="enslaver" }
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
                          {node.information}               
                        </Popover>
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
                    strokeWidth="5"
                  />
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
      }
    </div>
  )
}
