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
import { set } from "lodash";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

var nodeLayers = {};
var linkLayers = {};

var groupby_fields_region = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id",
	"voyage_itinerary__imp_principal_region_slave_dis__geo_location__id",
];

// only use for pivot table
var groupby_fields_region_name = [
  "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__name",
	"voyage_itinerary__imp_principal_region_slave_dis__geo_location__name",
];

var groupby_fields_port = [
  'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id',
	'voyage_itinerary__imp_principal_port_slave_dis__geo_location__id'
];

// only use for pivot table
var groupby_fields_port_name = [
  'voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__name',
	'voyage_itinerary__imp_principal_port_slave_dis__geo_location__name'
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
var customIcon = L.divIcon({className: 'leaflet-div-icon2'})

// Drawing nodes and edges on the map
export function ReadFeature(props) {
  const [isLoading, setIsLoading] = useState(false);

  const [csv, setCsv] = useState(null);
  const [nodes, setNodes] = useState(null);

  const [groupby_fields, setGroupBy] = useState(groupby_fields_region); // used for aggroutes useEffect

  const map = useMap();

  // Popup
  const [disembark, setDisembark] = React.useState('voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id');
  const [area, setArea] = useState(groupby_fields_region[0]); // port or region
  const [complete_object, set_complete_object] = useState({
    groupby_fields: groupby_fields_region_name,
    value_field_tuple: value_field_tuple,
    cachename: ["voyage_pivot_tables"],
  });

  var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      return L.divIcon({ html: '<div><span>' + cluster.getChildCount() + '</span></div>' , 
                          className: ' cluster-small', 
                          });
	}
  });

  L.Marker.prototype.options.icon = customIcon;

  // var markers = L.markerClusterGroup();

  map.on('zoomend', function() {
    
    console.log("Zoom: ", map.getZoom())
    
        
    if(map.getZoom() < 8) {
      setGroupBy(groupby_fields_region)
      set_complete_object({
        ...complete_object,
        groupby_fields: groupby_fields_region_name,
      });
      setArea(groupby_fields_region[0]);
    }
    else {
      //console.log("Set Port")
      setGroupBy(groupby_fields_port)
      set_complete_object({
        ...complete_object,
        groupby_fields: groupby_fields_port_name,
      });
      setArea(disembark);
    }

  })


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

      //console.log("Repsonse:", response.data)
    });
  }, [props.search_object, groupby_fields]);


  //for updating search object

  useEffect(() =>{
    //selected disembark
    if (disembark === diskey ){
      //if currently search_object is embark
        // console.log("🚀 ~ file: Spatial.js ~ line 95 ~ useEffect ~ DISEMBARK")  
        const res = delete Object.assign(complete_object, {[diskey]: complete_object[embkey] })[embkey];
        // console.log("🚀 ~ file: Spatial.js ~ line 150 ~ useEffect ~ res", res)
       set_complete_object(complete_object)
      //  console.log("🚀 ~ file: Spatial.js ~ line 152 ~ useEffect ~ set_complete_object(complete_object)", set_complete_object(complete_object))
      // }
      }
    else{

        //  console.log("🚀 ~ file: Spatial.js ~ line 95 ~ useEffect ~ EMBARK")
        const res = delete Object.assign(complete_object, {[embkey]: complete_object[diskey] })[diskey];
        // console.log("🚀 ~ file: Spatial.js ~ line 150 ~ useEffect ~ res", res)
       set_complete_object(complete_object)
      //  console.log("🚀 ~ file: Spatial.js ~ line 152 ~ useEffect ~ set_complete_object(complete_object)", set_complete_object(complete_object))
      
     }

    // console.log("🚀 ~ file: Spatial.js ~ line 176 ~ useEffect ~ complete_object", JSON.parse(JSON.stringify(complete_object)))


  },[disembark])

  useEffect(() =>{
    let point = complete_object[area];
    if (area === groupby_fields_region[0]){
        delete Object.assign(complete_object, {[area]: point })[disembark];
      }
    else if (area === disembark) {
        delete Object.assign(complete_object, {[area]: point })[groupby_fields_region[0]];
     }
     set_complete_object(complete_object)
  },[area])

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
    var filterNodes = (feature) => {
      //if embarkation is selected; only show nodes on African side
      if(props.radio == "embarkation"){
        return feature.geometry.coordinates[0]>=-23.334960 && !feature.properties.name.includes("ocean waypt")
      }else{ //if disembarkation is selected, only show nodes on American side
        return feature.geometry.coordinates[0]<-23.334960 && !feature.properties.name.includes("ocean waypt");
      }
      
    };
    
    //console.log(props.search_object.dataset[0]==0)
    if (nodes) {
      // Add all features for drawing links (including waypoints to nodeslayers)
      L.geoJSON(nodes.features, {
        onEachFeature: function (feature, layer) {
          nodeLayers[feature.id] = {
            layer: layer,
          };
        },
      });
      map.removeLayer(markers)
      // Add only actual locations to the map with markers (with clicking events and popups)
      if(!props.filter){
        filterNodes=(feature)=>{return true}
      }
      L.geoJSON(nodes.features, {
        filter: filterNodes,
        onEachFeature: function (feature, layer) {
          //console.log(props.search_object.dataset[0]==0)
          L.marker(layer["_latlng"]).unbindPopup()
          // mouseover or click, which is better
          layer.on("mouseover", function (e) {
            complete_object[area] = [layer.feature.id, layer.feature.id];
            const container = L.DomUtil.create("div");
            ReactDOM.createRoot(container).render(
              <PivotContext.Provider
              value={{ complete_object, set_complete_object , disembark, setDisembark}}
            >
              <Grid>
                                {layer.feature.properties.name +
                  " " +
                  layer.feature.geometry.coordinates}
              
              
                <div style={{ fontSize: "24px", color: "black" }}>
                  <div>
                   
                      {/* only show if intraamerican, otherwise hidden */
                      }
                        {props.search_object.dataset[0] == 0? "":<IntraTabs context={PivotContext}/>}
                      <Pivot context={PivotContext} />
                  </div>
                </div>
              </Grid>
              </PivotContext.Provider>
            );
            

            // L.marker(layer["_latlng"]).addTo(map).bindPopup(container, {
            //   maxWidth: "auto",
            // });
            markers.addLayer(layer).bindPopup(container, {maxWidth:"auto"})
        })
          markers.addLayer(layer)
        },
      });

      map.addLayer(markers);
      // DrawLink(map, csv);
      drawUpdate(map, csv)
      
    }
  }, [nodes, csv,props.search_object.dataset]);


  if (isLoading == false) {
    return "isLoading";
  }

  return null;
}

function drawUpdate(map, routes) {

  var valueMin = d3.min(routes, function (l) {
    return l[2];
  });
  var valueMax = d3.max(routes, function (l) {
    return l[2];
  });
  
  var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);


  routes.map(route => {
    var commands = [];

    commands.push('M', route[0][0])
    commands.push('C', route[1][0], route[1][1], route[0][1])

    L.curve(commands, {color: 'blue', weight: valueScale(route[2])}).bindPopup("Sum of slaves: " + route[2]).addTo(map)
  })

}


// Function to draw the curve routes
function DrawRoutes(map, links) {
  var valueMin = d3.min(links, function (l) {
    return l[0];
  });
  var valueMax = d3.max(links, function (l) {
    return l[0];
  });

  var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);
  
  links.map(array=> {
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