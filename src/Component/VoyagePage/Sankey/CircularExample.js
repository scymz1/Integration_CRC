
import React from "react";
import {useQuery} from 'react-query';
import { Group } from "@vx/group";
import { Text } from "@vx/text";
import { scaleSequential } from "d3-scale";
import { interpolateCool } from "d3";
import { format as d3format } from "d3-format";
import { linkHorizontal } from "d3-shape";
import axios from "axios";
import Sankey from "./CircularSankey";
import { useState } from "react";
import {Button} from "@mui/material";
import { type } from "@testing-library/user-event/dist/type";
// import myJson from './sample.json';
// console.log("🐢this is the myJson" + myJson);
// var jp = require('jsonpath');
// console.log("============================")
// var names = jp.query(myJson, '$.features[*].properties.name');
// console.log("🌸this is the names" + names);
// var FormData = require('form-data');
// var data = new FormData();
// data.append('groupby_fields', 'voyage_itinerary__principal_port_of_slave_dis__geo_location__name');
// data.append('groupby_fields', 'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name');
// data.append('value_field_tuple', 'voyage_slaves_numbers__imp_total_num_slaves_disembarked');
// data.append('value_field_tuple', 'sum');
// data.append('cachename', 'voyage_export');

// var config = {
//   method: 'post',
//   url: 'https://voyages3-api.crc.rice.edu/voyage/crosstabs',
//   headers: {
//     'Authorization': 'Token d4acb77be3a259c23ee006c70a20d70f7c42ec23',
//     ...data.getHeaders()
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

export default function SankeyExample(props) {
  const {isLoading, error, data} = useQuery('',() => {
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Token d4acb77be3a259c23ee006c70a20d70f7c42ec23");

var formdata = new FormData();
formdata.append("groupby_fields", "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__id");
formdata.append("groupby_fields", "voyage_itinerary__imp_region_voyage_begin__geo_location__id");
formdata.append("value_field_tuple", "voyage_slaves_numbers__imp_total_num_slaves_disembarked");
formdata.append("value_field_tuple", "sum");
formdata.append("cachename", "voyage_maps");

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

return fetch("https://voyages3-api.crc.rice.edu/voyage/crosstabs", requestOptions)
  .then(response => response.json())
  .then(result => {

    let allNodes=new Set()
    let nodes = []
    let links = []

    // console.log(result)
    console.log(typeof(result))
    
    Object.keys(result).forEach(source =>{
      allNodes.add(source)
      Object.keys(result[source]).forEach(target =>{
        allNodes.add(target)
      })
    })
    console.log(allNodes)

   allNodes.forEach((source) =>{
      nodes.push({"name": source})
   })

    Object.keys(result).forEach(source =>{
      Object.keys(result[source]).forEach(target =>{
        links.push({
          "source": [...allNodes].indexOf(source),
          "target": [...allNodes].indexOf(target),
          "value": result[source][target]
        })
      })
    })

    // console.log(nodes)
    // console.log(links)

    console.log(
      {
        nodes: nodes,
        links:links
      }
    )


    return {
      nodes: nodes,
      links:links
    }

  })
  .catch(error => console.log('error', error));
  })

  
  // print the request data 
  
  const [state, setState] = useState({
    highlightLinkIndexes: [],
    nodePadding: 10,
    component: "Sankey",
  });

  const path = linkHorizontal()
    .source((d) => [d.source.x1, d.y0])
    .target((d) => [d.target.x0, d.y1]);

  const color = scaleSequential(interpolateCool);

  const {
    width,
    height,
    margin = {
      top: 0,
      left: 0,
      right: 200,
      bottom: 0,
    },
  } = props;

  if (width < 10) return null;
  if(isLoading) return "loading";
  // state = {
  //   highlightLinkIndexes: [],
  //   nodePadding: 10,
  //   component: "Sankey"
  // };
  // return{

  // }

  return (
    <div>
      <Button onClick={()=>console.log("data:", data)}>print data</Button>
      <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
      >
        <Sankey
          top={margin.top}
          left={margin.left}
          data={data}
          size={[width, height]}
          nodeWidth={15}
          nodePadding={state.nodePadding}
          extent={[
            [1, 1],
            [width - 1, height - 6],
          ]}
        >
          {({ data }) => (
            <Group>
              {data.nodes.map((node, i) => (
                <Group top={node.y0} left={node.x0} key={`node-${i}`}>
                  <rect
                    id={`rect-${i}`}
                    width={node.x1 - node.x0}
                    height={node.y1 - node.y0}
                    fill={color(node.depth)}
                    opacity={0.5}
                    stroke="white"
                    strokeWidth={2}
                    onMouseOver={(e) => {
                      setState({
                        highlightLinkIndexes: [
                          ...node.sourceLinks.map((l) => l.index),
                          ...node.targetLinks.map((l) => l.index),
                        ],
                      });
                    }}
                    onMouseOut={(e) => {
                      setState({ highlightLinkIndexes: [] });
                    }}
                  />

                  <Text
                    x={18}
                    y={(node.y1 - node.y0) / 2}
                    verticalAnchor="middle"
                    style={{
                      font: "10px sans-serif",
                    }}
                  >
                    {node.name}
                  </Text>
                </Group>
              ))}

              <Group>
                {data.links.map((link, i) => (
                  <path
                    key={`link-${i}`}
                    d={path(link)}
                    stroke="black"
                    stroke={
                      state.highlightLinkIndexes.includes(i) ? "red" : "black"
                    }
                    strokeWidth={Math.max(1, link.width)}
                    // opacity={0.2}
                    opacity={
                      state.highlightLinkIndexes.includes(i) ? 0.5 : 0.15
                    }
                    fill="none"
                    // onMouseOver={(e) => {
                    //   setState({ highlightLinkIndexes: [i] });
                    // }}
                    // onMouseOut={(e) => {
                    //   setState({ highlightLinkIndexes: [] });
                    // }}
                  />
                ))}
              </Group>
            </Group>
          )}
        </Sankey>
      </svg>
    </div>
  );
}
