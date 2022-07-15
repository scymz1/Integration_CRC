// The Spatial.js is a component to read a csv file and a Geojson file and draw the geosankey diagram on the map.
// References: https://github.com/geodesign/spatialsankey, https://github.com/UNFPAmaldives/migration

import React, { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { Grid } from "@mui/material";
//import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import * as d3 from "d3";
import axios from "axios";
import Pivot from "../Result/Pivot/Pivot";
import ReactDOM from "react-dom/client";
import IntraTabs from "./Tab";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

var nodeLayers = {};
var linkLayers = {};

var groupby_fields = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id",
	"voyage_itinerary__imp_principal_region_slave_dis__geo_location__id",

];
var value_field_tuple = [
  "voyage_slaves_numbers__imp_total_num_slaves_disembarked",
  "sum",
];
var cachename = "voyage_maps";
var dataset = [0, 0];
var output_format = "geosankey";
const diskey = "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id" 
const embkey = "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id" 

export const PivotContext = React.createContext({});

// Drawing nodes and edges on the map
export function ReadFeature(props) {
  const [isLoading, setIsLoading] = useState(false);
  //console.log("readfeature---------",props.search_object.dataset[0])

  const [csv, setCsv] = useState(null);
  const [nodes, setNodes] = useState(null);
  const [disembark, setDisembark] = React.useState('voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id');

  // const {search_object} = React.useContext(PastContext);
  const map = useMap();

  const [complete_object, set_complete_object] = useState({
    voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id: [
      20931, 20931,
    ],
    groupby_fields: [
      "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name",
      "voyage_itinerary__imp_principal_region_slave_dis__geo_location__name",
    ],
    value_field_tuple: [
      "voyage_slaves_numbers__imp_total_num_slaves_disembarked",
      "sum",
    ],
    cachename: ["voyage_pivot_tables"],
  });

  var markers = L.markerClusterGroup();

  useEffect(() => {
    var data = new FormData();
    for (var property in props.search_object) {
 
      props.search_object[property].forEach((v) => {
        data.append(property, v);
      });
    }
    data.append("groupby_fields", groupby_fields[0]);
    data.append("groupby_fields", groupby_fields[1]);
    data.append("value_field_tuple", value_field_tuple[0]);
    data.append("value_field_tuple", value_field_tuple[1]);
    data.append("cachename", cachename);
    data.append("output_format", output_format);

    axios.post("/voyage/aggroutes", data).then(function (response) {
      setIsLoading(true);
      setCsv(response.data.routes);
      setNodes(response.data.points);

      console.log("Repsonse:", response.data)
    });
  }, [props.search_object]);


  //for updating search object

  // useEffect(() =>{
  //   //selected disembark
  //   if (disembark === diskey ){
  //     //if currently search_object is embark
  //     if(complete_object[embkey]){
  //       console.log("🚀 ~ file: Spatial.js ~ line 95 ~ useEffect ~ DISEMBARK")  
  //       delete Object.assign(complete_object, {[diskey]: complete_object[embkey] })[embkey];
  //     }
  //     }
  //   else{
  //     if(complete_object[diskey]){
  //       console.log("🚀 ~ file: Spatial.js ~ line 95 ~ useEffect ~ EMBARK")
  //       delete Object.assign(complete_object, {[embkey]: complete_object[diskey] })[diskey];
  //     }
      
  //    }

  //   console.log("🚀 ~ file: Spatial.js ~ line 176 ~ useEffect ~ complete_object", complete_object)


  // },[disembark])


  useEffect(() => {
    for (var i in map._layers) {
      if (
        map._layers[i]._path != undefined ||
        map._layers[i]._layers != undefined
      ) {
        try {
          map.removeLayer(map._layers[i]);
        } catch (e) {
          console.log("problem with " + e + map._layers[i]);
        }
      }
    }

    //filter nodes so that the return nodes are all on the left/right of longitude -23.334960 and are not ocean waypts
    const filterNodes = (feature) => {
      //if embarkation is selected; only show nodes on African side
      if(props.radio == "embarkation"){
        return feature.geometry.coordinates[0]>=-23.334960 && !feature.properties.name.includes("ocean waypt")
      }else{ //if disembarkation is selected, only show nodes on American side
        return feature.geometry.coordinates[0]<-23.334960 && !feature.properties.name.includes("ocean waypt");
      }
      
    };
    

    if (nodes) {
      // Add all features for drawing links (including waypoints to nodeslayers)
      L.geoJSON(nodes.features, {
        onEachFeature: function (feature, layer) {
          nodeLayers[feature.id] = {
            layer: layer,
          };
        },
      });

      // Add only actual locations to the map with markers (with clicking events and popups)
      L.geoJSON(nodes.features, {
        //filter: featureWayPt,
        filter: filterNodes,
        onEachFeature: function (feature, layer) {
        
          // mouseover or click, which is better
          layer.on("mouseover", function (e) {
          console.log("🚀 ~ file: Spatial.js ~ line 262 ~ mouseover complete_object", complete_object)

            let tmp =
              complete_object[
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id"
              ];
            tmp[0] = layer.feature.id;
            tmp[1] = layer.feature.id;
            set_complete_object({
              ...complete_object,
              voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id:
                tmp,
            });

          //   if (disembark === diskey ){
          //     console.log("🚀 ~ file: Spatial.js ~ line 95 ~ mouseover ~ DISEMBARK")  
          //       let tmp =
          //   complete_object[
          //     'voyage_itinerary__imp_principal_port_slave_dis__geo_location__id'
          //   ];
    
          // tmp[0] = layer.feature.id;
          // tmp[1] = layer.feature.id;
          //   set_complete_object({
          //     ...complete_object,
          //     voyage_itinerary__imp_principal_port_slave_dis__geo_location__id:
          //       tmp,
          //   });
          //    }
          //    else{
          //     console.log("🚀 ~ file: Spatial.js ~ line 95 ~ mouseover ~ EMBARK")
          //   let tmp =
          //   complete_object[
          //     'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id'
          //   ];
          //   console.log("🚀 ~ file: Spatial.js ~ line 172 ~ tmp", tmp)
          // tmp[0] = layer.feature.id;
          // tmp[1] = layer.feature.id;
          //   set_complete_object({
          //     ...complete_object,
          //     voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id:
          //       tmp,
          //   });

          //   console.log("🚀 ~ file: Spatial.js ~ line 172 ~ mouseover  tmp", tmp)
              
          //   //  }
          //   console.log("🚀 ~ file: Spatial.js ~ line 231 ~ before tmp complete_object", complete_object)
            
          // //   let tmp =
          // //   complete_object[
          // //     [disembark]
          // //   ];
          // //   console.log("🚀 ~ file: Spatial.js ~ line 172 ~ tmp", tmp)
          // // tmp[0] = layer.feature.id;
          // // tmp[1] = layer.feature.id;
          // //   set_complete_object({
          // //     ...complete_object,
          // //     [disembark]:
          // //       tmp,
          // //   });

    
            
          //   const container = L.DomUtil.create("div");
          //   ReactDOM.createRoot(container).render(
          //     <Grid>
          //                       {layer.feature.properties.name +
          //         " " +
          //         layer.feature.geometry.coordinates}
              
              
          //       <div style={{ fontSize: "24px", color: "black" }}>
          //         <div>
          //           <PivotContext.Provider
          //             value={{ complete_object, set_complete_object , disembark, setDisembark}}
          //           >
          //             {/* only show if intraamerican, otherwise hidden */}
          //               {props.search_object.dataset[0] === 1?<IntraTabs context={PivotContext}/>: ""}

          //             <Pivot context={PivotContext} />
          //           </PivotContext.Provider>
          //         </div>
          //       </div>
          //     </Grid>
          //   );
          //   // if we use bindPopup, then we have to use mouseover,
          //   // otherwise, only the second click can show the popup
          //   L.marker(layer["_latlng"]).addTo(map).bindPopup(container, {
          //     maxWidth: "auto",
          //   });
          //   // if we use click & popup.setContent, we will find the location of marker is incorrect.
          //   // L.popup({
          //   //   'maxWidth': 'auto',
          //   // })
          //   //    .setContent(container)
          //   //    .setLatLng(layer["_latlng"])
          //   //    .openOn(map);
          // };
        })
          markers.addLayer(layer);
        },
      });

      map.addLayer(markers);
      // DrawLink(map, csv);
      DrawRoutes(map, csv)
      
    }
  }, [nodes, csv]);


  if (isLoading == false) {
    return "isLoading";
  }

  return null;
}

// Function to draw the curve routes
function DrawRoutes(map, links) {
  var valueMin = d3.min(links, function (l) {
    return l[0];
  });
  var valueMax = d3.max(links, function (l) {
    return l[0];
  });

  console.log(valueMax)

  var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);
  
  links.map(array=> {
    // console.log(array)
    draw(map, array, valueScale)
  })
}

function draw(map, link, valueScale) {

  var weight = link[0]
  var route = link[1]

  var commands = []
  commands = ["M", route[0]]

  commands.push("Q", route[1][0], route[1][1])

  for(var i = 2; i < route.length; i++) {
    commands.push("C", route[i][0], route[i][1], route[i][2])
  }

  // console.log("Commands: ", commands)

  L.curve(commands, {color:'blue', weight: valueScale(weight)}).bindPopup("Sum of slaves: " + weight).addTo(map);
}


// Function to draw the edges (line segments)
function DrawLink(map, links) {
  var valueMin = d3.min(links, function (l) {
    return l[0] != l[1] ? parseInt(l[2]) : null;
  });
  var valueMax = d3.max(links, function (l) {
    return l[0] != l[1] ? parseInt(l[2]) : null;
  });

  var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);

  links.forEach(function (link) {
    if (link[0] != link[1]) {
      var path = [link[0], link[1]].join("-");
      var pathReverse = [link[1], link[0]].join("-");

      var lineWeight = valueScale(link[2]);

      var lineCenterLatLng = L.polyline([
        nodeLayers[link[0]].layer._latlng,
        nodeLayers[link[1]].layer._latlng,
      ])
        .getBounds()
        .getCenter();

      var line = L.polyline(
        [
          nodeLayers[link[0]].layer._latlng,
          nodeLayers[link[1]].layer._latlng,
        ],
        {
          weight: lineWeight,
        }
      );

      var feature = L.featureGroup([line])
        .bindPopup(
          "<p3>" +
            link[0] +
            "</p3> to <p3>" +
            link[1] +
            "</p3>" +
            "<br>" +
            "<p4>" +
            link[2] +
            " migrants" +
            "</p4>"
        )
        .on("click", function (e) {
          this.openPopup();

          this.setStyle({
            opacity: 1,
          });
        })
        .addTo(map);

      linkLayers[path] = {
        feature: feature,
        line: line,
        data: link,
      };
    }
  });

  return null;
}
