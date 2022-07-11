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
    const {queryData, setQueryData, data} = useContext(PASTContext);
    const CANVAS_WIDTH = 700;
    const CANVAS_HEIGHT = 500;
    const NODE_WIDTH = 120;
    const MIN_NODE_HEIGHT = 20;
    const MIN_SPACE_BETWEEN_NODES_VERTICAL = 20;

    var SampleRawData = [
      {
        "transactions": [
          {
                "id": 133597,
                "transaction": {
                    "id": 11495,
                    "relation_type": {
                        "id": 2,
                        "relation_type": "transportation"
                    },
                    "enslavers": [
                        {
                            "id": 11852,
                            "enslaver_alias": {
                            "id": 56489,
                            "alias": "Early, William"
                            },
                            "role": {
                              "id": 5,
                              "role": "owner"
                            }
                        },
                      ]
                    }
          },
        {
                "id": 170955,
                "transaction": {
                    "id": 16804,
                    "relation_type": {
                      "id": 2,
                      "relation_type": "transportation"
                    },
                    "enslavers": [
                      {
                        "id": 17161,
                        "enslaver_alias": {
                        "id": 56489,
                        "alias": "Early, William"
                        },
                        "role": {
                          "id": 7,
                          "role": "consignor"
                        },
                      },
                    ]
                  }
          }
        ],
        "id": 500001,
        "documented_name": "Delia?"
      },
      {
        "transactions": [
            {
                  "id": 133597,
                  "transaction": {
                      "id": 11495,
                      "relation_type": {
                        "id": 2,
                        "relation_type": "transportation"
                      },
                      "enslavers": [
                          {
                              "id": 11852,
                              "enslaver_alias": {
                              "id": 56489,
                              "alias": "Early, William"
                              },
                              "role": {
                                "id": 7,
                                "role": "consignor"
                              },
                          }]
                    }
            }
          ],
          "id": 500101,
          "documented_name": "Carter, Fanny"
        },
    ];
  
    var nodes = [];
    var links = [];
  
    for (var i = 0; i < SampleRawData.length; i++) {
      nodes.push({id: SampleRawData[i].id, name: SampleRawData[i].documented_name});
  
        for (var j = 0; j < SampleRawData[i].transactions.length; j++) {
          if (nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.id) === -1) {
              nodes.push({id: SampleRawData[i].transactions[j].transaction.id, 
                          name: SampleRawData[i].transactions[j].transaction.relation_type.relation_type});
          }
          if (links.findIndex(x => x.source === nodes.findIndex(x => x.id === SampleRawData[i].id) &&
                                   x.target === nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.id)) === -1) {
              links.push({source: nodes.findIndex(x => x.id === SampleRawData[i].id),
                          target: nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.id),
                          value:5})
          }
            for (var z = 0; z < SampleRawData[i].transactions[j].transaction.enslavers.length; z++) {
              if (nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.enslavers[z].enslaver_alias.id) === -1) {
                  nodes.push({id: SampleRawData[i].transactions[j].transaction.enslavers[z].enslaver_alias.id, 
                              name: SampleRawData[i].transactions[j].transaction.enslavers[z].enslaver_alias.alias});
              }
              if (links.findIndex(x => x.source === nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.id) &&
                                       x.target === nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.enslavers[z].enslaver_alias.id)) === -1) {
                  links.push({source: nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.id),
                              target: nodes.findIndex(x => x.id === SampleRawData[i].transactions[j].transaction.enslavers[z].enslaver_alias.id),
                              value:5})
              }
            }
        }
    };

  const graph = sankey()
    .nodeAlign(sankeyLeft)
    .nodeWidth(NODE_WIDTH)
    .nodePadding(MIN_NODE_HEIGHT + MIN_SPACE_BETWEEN_NODES_VERTICAL)
    .extent([
      [30, 30],
      [CANVAS_WIDTH, CANVAS_HEIGHT]
    ])({nodes, links});

  return (
    <div>
      <h1>Sankey</h1>
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <Button onClick={()=>console.log("graph:", graph)}>print graph</Button>
      <Button onClick={()=>console.log("graph:", queryData)}>print queryData</Button>
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
                <span className="node-title">
                  {truncate(node.name, { length: 35 })}
                </span>
                <br/>
                <span className="node-title">
                  {truncate(node.id, { length: 35 })}
                </span>
              </div>
            </foreignObject>
          </>
      )})}
          {graph.links.map((link) => {
            return(
              <path
                key={`sankey-link-${link.index}`}
                className="link"
                d={sankeyLinkHorizontal()(link)}
                fill="none"
                stroke="#1e3162"
                opacity="0.5"
                strokeWidth="5"   
              />
            )
            })}
    </svg>
    </div>
  )
}
