import { useContext, useEffect, useState } from "react";
import { PASTContext } from "../PASTApp";
import * as React from "react";
import { Box,Button, Modal,Typography,Popover } from "@mui/material";
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
    const MIN_NODE_HEIGHT = 60;

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const popopen = Boolean(anchorEl);
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
        nodes.push({id: data[i].id, name: data[i].documented_name}); 
        transLength = transLength + data[i].transactions.length;
          for (var j = 0; j < data[i].transactions.length; j++) {
            if (nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id) === -1) {
                nodes.push({id: data[i].transactions[j].transaction.id, 
                            name: data[i].transactions[j].transaction.relation_type.relation_type,
                            voyage_id: data[i].transactions[j].transaction.voyage.id});
            }
            if (links.findIndex(x => x.source === nodes.findIndex(x => x.id === data[i].id) &&
                                    x.target === nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id)) === -1) {
                links.push({source: nodes.findIndex(x => x.id === data[i].id),
                            target: nodes.findIndex(x => x.id === data[i].transactions[j].transaction.id),
                            color: "#1e3162",
                            info: "",
                            value:5})
            }
            enslaverLength = enslaverLength + data[i].transactions[j].transaction.enslavers.length;
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
        // console.log(node)
        const result = [];
        for (var i = 0; i < Object.keys(node).length; i++) {
          if(Object.keys(node)[i]==="voyage_id"){
            // console.log(Object.values(node)[i])
            node.voyage_id = <Button onClick={handleOpen}>{Object.values(node)[i]}</Button>
            // console.log(Object.values(node)[i]) 
          }
          result.push(
            <tr key = {Object.keys(node)[i]}>
              <th>{Object.keys(node)[i]}</th>
              <td>{Object.values(node)[i]}</td>
            </tr>
          );
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

    
    

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
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
                <Popover
                  id="mouse-over-popover"
                  sx={{
                    pointerEvents: 'none',
                  }}
                  open={popopen}
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
                  disableRestoreFocus
                >
                  {node.information}
                </Popover>
                <Typography
                  aria-owns={popopen ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={handlePopoverOpen}
                  onMouseLeave={handlePopoverClose}
                >
                
                  <tbody>
                    {/* {node.information} */}
                    {node.name}
                    {node.id}
                    {node.voyage_id}
                  </tbody>
                  </Typography>
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
