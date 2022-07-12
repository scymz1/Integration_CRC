// The Spatial.js is a component to read a csv file and a Geojson file and draw the geosankey diagram on the map.
// References: https://github.com/geodesign/spatialsankey, https://github.com/UNFPAmaldives/migration

import React, { useState, useEffect } from "react";
import { useMapEvents, GeoJSON, useMap } from "react-leaflet";
import { Grid } from "@mui/material";
//import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import * as d3 from "d3";
import axios from "axios";
import Pivot from "../Result/Pivot/Pivot";
import ReactDOM from "react-dom/client";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

var nodeLayers = {};
var linkLayers = {};
var selectedNode = null;

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
    console.log("🚀 ~ file: Spatial.js ~ line 66 ~ useEffect ~ props.search_object", props.search_object)
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

    // Function for distinguish if the feature is a waypoint
    const featureWayPt = (feature) => {
      return !feature.properties.name.includes("ocean waypt");
    };


  const filterNodes = (feature) => {
    console.log("🚀 ~ file: Spatial.js ~ line 110 ~ filterNodes ~ props.radio", props.radio)
    //if embarkation is selected; only show nodes on African side
    if(props.radio == "embarkation"){
      return feature.geometry.coordinates[0]>=-23.334960
    }else{ //if disembarkation is selected, only show nodes on American side
      return feature.geometry.coordinates[0]<23.334960
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
        filter: featureWayPt,
        filter: filterNodes,
        onEachFeature: function (feature, layer) {
          console.log('124')
          // mouseover or click, which is better
          layer.on("mouseover", function (e) {
            console.log("current id = ", layer.feature.id);
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
      DrawLink(map, csv);
    }
  }, [nodes, csv]);

  if (isLoading == false) {
    return "isLoading";
  }

  // Add only actual locations to the map (with clicking events and popups)
  // var nodeLayer = L.geoJSON(nodes.features, {
  //     filter: featureWayPt,

  //     onEachFeature: function (feature, layer) {

  //       layer
  //         .on('click', function(e) {
  //           layer.closePopup();

  //           for(var linkPath in linkLayers) {
  //             var path = linkPath.split('-');

  //             // when click on a node, show only the edges that attach to it
  //             if (selectedNode != null && selectedNode != path[0]) {
  //               map.addLayer(linkLayers[linkPath].feature);
  //             }
  //           }

  //           if (selectedNode == null || selectedNode != feature.id) {

  //             for (var linkPath in linkLayers) {
  //               var path = linkPath.split('-');

  //               if (feature.id != path[0] && feature.id != path[1]) {
  //                   map.removeLayer(linkLayers[linkPath].feature);
  //               }
  //               else {
  //                   // num += parseInt(linkLayers[linkPath].data.value);
  //               }
  //             }

  //             selectedNode = feature.id;
  //           }
  //           else {
  //             selectedNode = null;
  //           }
  //         });
  //         layer.bindPopup(layer.feature.properties.name)
  //         markers.addLayer(layer);
  //     }

  //     onEachFeature: function (feature, layer) {

  //       layer
  //         .on('click', function(e) {
  //           layer.closePopup();

  //           for(var linkPath in linkLayers) {
  //             var path = linkPath.split('-');

  //             // when click on a node, show only the links that attach to it
  //             if (selectedNode != null && selectedNode != path[0]) {
  //               map.addLayer(linkLayers[linkPath].feature);
  //             }
  //           }

  //           if (selectedNode == null || selectedNode != feature.id) {

  //             for (var linkPath in linkLayers) {
  //               var path = linkPath.split('-');

  //               if (feature.id != path[0] && feature.id != path[1]) {
  //                   map.removeLayer(linkLayers[linkPath].feature);
  //               }
  //               else {
  //                   // num += parseInt(linkLayers[linkPath].data.value);
  //               }
  //             }

  //             selectedNode = feature.id;
  //           }
  //           else {
  //             selectedNode = null;
  //           }
  //         });
  //         layer.bindPopup(layer.feature.properties.name)
  //         markers.addLayer(layer);
  //     }

  //   });

  // map.addLayer(markers)
  // DrawLink(map, csv);

  return null;
}

// Function to draw the edges
function DrawLink(map, links, layers, setLayers) {
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
