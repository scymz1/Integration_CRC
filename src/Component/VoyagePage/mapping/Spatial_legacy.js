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

import { curve, Curve } from 'leaflet';
import '@elfalem/leaflet-curve';

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

var nodeLayers = {};
var linkLayers = {};

var groupby_fields = [
  "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id",
  "voyage_itinerary__imp_principal_port_slave_dis__geo_location__id",
];
var value_field_tuple = [
  "voyage_slaves_numbers__imp_total_num_slaves_disembarked",
  "sum",
];
var cachename = "voyage_maps";
var dataset = [0, 0];
var output_format = "geosankey";

export const PivotContext = React.createContext({});

// Drawing nodes and edges on the map
export function ReadFeature(props) {
  const [isLoading, setIsLoading] = useState(false);

  const [csv, setCsv] = useState(null);
  const [nodes, setNodes] = useState(null);

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
      setCsv(response.data.links);
      setNodes(response.data.nodes);
      setIsLoading(true);
    });
  }, [props.search_object]);


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

    // var a=[50.54136296522163,28.520507812500004];
    // var b=[46.680797145321655,33.83789062500001];
    // var c=[52.214338608258224,39.564453125000004];
    // var d=[48.214338608258224,40.564453125000004];
    // var control0=controlPoint(0.2, map, a, a, b, false);
    // var control1=controlPoint(0.2, map, b, a, c, false);
    // var control2=controlPoint(0.2, map, c, b, d, false);

    // var path = L.curve(['M',[50.54136296522163,28.520507812500004],
    // 'Q', control0, b,
    // 'Q', control1, c,
    // 'Q', control2, d,
    // 'V',[48.40003249610685],
    // 'L',[47.45839225859763,31.201171875],
    //   [48.40003249610685,28.564453125000004],
    // 'Z'],
    // {color:'red',fill:true}).addTo(map);



    // Function for distinguish if the feature is a waypoint
    // const featureWayPt = (feature) => {
    //   return !feature.properties.name.includes("ocean waypt");
    // };

    //filter nodes so that the return nodes are all on the left/right of longitude -23.334960 and are not ocean waypts
    const filterNodes = (feature) => {
      console.log("🚀 ~ file: Spatial.js ~ line 110 ~ filterNodes ~ props.radio", props.radio)
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
        //filter: filterNodes,
        onEachFeature: function (feature, layer) {
          console.log('112')
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
            console.log("current id = ", layer.feature.id);
            console.log("🚀 ~ file: Spatial.js ~ line 137 ~ useEffect ~ layer", layer)
            let tmp =[layer.feature.id, layer.feature.id];
            //   complete_object[
            //     "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id"
            //   ];
            // tmp[0] = layer.feature.id;
            // tmp[1] = layer.feature.id;
            console.log(tmp);
            set_complete_object({
              ...complete_object,
              voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id:
                tmp,
            });
            const container = L.DomUtil.create("div");
            ReactDOM.createRoot(container).render(
              <Grid>
                {layer.feature.properties.name +
                  " " +
                  layer.feature.geometry.coordinates}
                <div style={{ fontSize: "24px", color: "black" }}>
                  <div>
                    <PivotContext.Provider
                      value={{ complete_object, set_complete_object }}
                    >
                      <Pivot context={PivotContext} />
                    </PivotContext.Provider>
                  </div>
                </div>
              </Grid>
            );
            // if we use bindPopup, then we have to use mouseover,
            // otherwise, only the second click can show the popup
            L.marker(layer["_latlng"]).addTo(map).bindPopup(container, {
              maxWidth: "auto",
            });
            // if we use click & popup.setContent, we will find the location of marker is incorrect.
            // L.popup({
            //   'maxWidth': 'auto',
            // })
            //    .setContent(container)
            //    .setLatLng(layer["_latlng"])
            //    .openOn(map);
          });
          markers.addLayer(layer);
        },
      });

      map.addLayer(markers);
      //DrawLink(map, csv);
      DrawLink2(map);
    }
  }, [nodes, csv]);

  if (isLoading == false) {
    return "isLoading";
  }

  return null;
}

// Function to draw the edges
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

      // Having the link to be drawed with a curve where the link has flows in both directions
      var lineBreakLatLng = null;
      if (linkLayers[pathReverse]) {
        lineBreakLatLng = L.latLng(
          lineCenterLatLng.lat * 0.001 + lineCenterLatLng.lat,
          lineCenterLatLng.lng * 0.001 + lineCenterLatLng.lng
        );
      } else {
        lineBreakLatLng = L.latLng(
          lineCenterLatLng.lat - lineCenterLatLng.lat * 0.001,
          lineCenterLatLng.lng - lineCenterLatLng.lng * 0.001
        );
      }

      var line = L.polyline(
        [
          nodeLayers[link[0]].layer._latlng,
          lineBreakLatLng,
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

function DrawLink2(map){

  const line = (coord1, coord2) => {
    const lengthX = coord2.x - coord1.x;
    const lengthY = coord2.y - coord1.y;
  
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };

  const controlPoint = (smoothing, map, current, previous, next, reverse) => {
    /**
     * When current is the first or last point of the array, prev and next
     * dont exist.  Replace with current
     */
    const p = previous || current;
    const n = next || current;
  
    const currPoint = map.latLngToLayerPoint(L.latLng(current));
    const prevPoint = map.latLngToLayerPoint(L.latLng(p));
    const nextPoint = map.latLngToLayerPoint(L.latLng(n));
  
    let { length, angle } = line(prevPoint, nextPoint);
  
    angle = angle + (reverse ? Math.PI : 0);
    length = length * smoothing;
  
    const x = currPoint.x + Math.cos(angle) * length;
    const y = currPoint.y + Math.sin(angle) * length;
  
    const { lat, lng } = map.layerPointToLatLng([x, y]);
    return [lat, lng];
  };

  
  var routes=require("./transatlantic.json").routes;
  routes.map(
    (route)=>{
      var input = ['M', [route[0][1], route[0][0]]];
      for (var i = 1; i < route.length; i++) { 
        input.push('S'); input.push([route[i][1], route[i][0]]);
        if(i==route.length-1){
          var control = controlPoint(0.2, map, [route[i][1], route[i][0]], [route[i-1][1], route[i-1][0]], [route[i][1], route[i][0]], false);
          input.push(control);
        }
        else{
          var control = controlPoint(0.2, map, [route[i][1], route[i][0]], [route[i-1][1], route[i-1][0]], [route[i+1][1], route[i+1][0]], false);
          input.push(control);
        }
      }
      var path = L.curve(input,
      {color:'red',fill:false}).addTo(map);
      return null;
    }
  );
  return null;
}