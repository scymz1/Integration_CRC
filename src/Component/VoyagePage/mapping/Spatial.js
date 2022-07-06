// The Spatial.js is a component to read a csv file and a Geojson file and draw the geosankey diagram on the map.
// References: https://github.com/geodesign/spatialsankey, https://github.com/UNFPAmaldives/migration

import React, { useState, useEffect } from 'react'
import { useMapEvents, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import * as d3 from "d3";
import axios from 'axios'

import nodes2 from "./voyage_itinerary__imp_port_voyage_begin__geo_location__id_voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_Barbados_Jamaica_1700_1860_0_0";
import csv2 from "./voyage_itinerary__imp_port_voyage_begin__geo_location__id_voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_Barbados_Jamaica_1700_1860_0_0.csv"
import { set } from 'lodash';

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

var nodeLayers = {};
var linkLayers = {};
var selectedNode = null;

var groupby_fields = ['voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__id', 'voyage_itinerary__imp_principal_port_slave_dis__geo_location__id']
var value_field_tuple = ['voyage_slaves_numbers__imp_total_num_slaves_disembarked', 'sum']
var cachename = 'voyage_maps'
var dataset = [0, 0]
var output_format = 'geosankey'

// Drawing nodes and links on the map
  export function ReadFeature(props) {

    const [isLoading, setIsLoading] = useState(false);
    
    const [csv, setCsv] = useState(null);
    const [nodes, setNodes] = useState(null);
    const [layers, setLayers] = useState([]);
    
    // const {search_object} = React.useContext(PastContext);
    const map = useMap();


    useEffect(() => {
      var data = new FormData();
      console.log(props.search_object)
      for(var property in props.search_object) {
        props.search_object[property].forEach((v)=>{
            data.append(property, v)
        })
      }
      data.append('groupby_fields', groupby_fields[0]);
      data.append('groupby_fields', groupby_fields[1]);
      data.append('value_field_tuple', value_field_tuple[0]);
      data.append('value_field_tuple', value_field_tuple[1]);
      data.append('cachename', cachename);
      data.append('dataset', dataset[0]);
      data.append('dataset', dataset[1]);
      data.append('output_format', output_format);
  
      axios.post('/voyage/aggroutes', data)
          .then(function(response) {
            setCsv(response.data.links)
            setNodes(response.data.nodes)
            setIsLoading(true)
          })
    }, [props.search_object])
    
    useEffect(() => {
      // Function for distinguish if the feature is a waypoint
      // map.eachLayer(function (layer) {
      //   console.log("aaaa", layer)
      //   map.removeLayer(layer);
      // });

      setLayers([]);
      const featureWayPt = (feature) => {
          return !feature.properties.name.includes("ocean waypt");
      }

      var markers = L.markerClusterGroup();
      // Add all features (including waypoints to nodeslayers)
      console.log(nodes)
      if(nodes){
        L.geoJSON(nodes.features, {

          onEachFeature: function (feature, layer) {
              nodeLayers[feature.id] = {
                layer: layer,
                // center: layer.getBounds().getCenter()
              }
          }
        });
        map.addLayer(markers)
        setLayers([...layers, markers]);
        DrawLink(map, csv, layers, setLayers);
      }

    }, [nodes, csv])    

    if(isLoading == false) {
      return "isLoading"
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

  // Function to draw the links
  function DrawLink(map, links, layers, setLayers) {

      var valueMin = d3.min(links, function(l) { return (l[0] != l[1]) ? parseInt(l[2]) : null; });
      var valueMax = d3.max(links, function(l) { return (l[0] != l[1]) ? parseInt(l[2]) : null; });

      var valueScale = d3.scaleLinear()
                            .domain([valueMin, valueMax])
                            .range([1, 10]);

      links.forEach(function (link) {
        if (link[0] != link[1]) {
          var path = [link[0], link[1]].join('-');
          var pathReverse = [link[1], link[0]].join('-');

          var lineWeight = valueScale(link[2]);

          
          var lineCenterLatLng = L.polyline([ nodeLayers[link[0]].layer._latlng, nodeLayers[link[1]].layer._latlng ])
                    .getBounds()
                    .getCenter();


          // Having the link to be drawed with a curve where the link has flows in both directions
          var lineBreakLatLng = null;
          if (linkLayers[pathReverse]) {
              lineBreakLatLng = L.latLng(
                  (lineCenterLatLng.lat * .001) + lineCenterLatLng.lat, 
                  (lineCenterLatLng.lng * .001) + lineCenterLatLng.lng
              );
          }
          else {
              lineBreakLatLng = L.latLng(
                  lineCenterLatLng.lat - (lineCenterLatLng.lat * .001), 
                  lineCenterLatLng.lng - (lineCenterLatLng.lng * .001)
              );
          }

          var line = L.polyline(
            [ 
                nodeLayers[link[0]].layer._latlng, 
                lineBreakLatLng, 
                nodeLayers[link[1]].layer._latlng
            ], {
              weight: lineWeight
            });

            var feature = L.featureGroup([line])
                .bindPopup('<p3>' + link[0] + '</p3> to <p3>' + link[1] + '</p3>' + '<br>' + '<p4>' + link[2] + ' migrants' + '</p4>')
                .on('click', function(e) {
                    
                    this.openPopup();
                    
                    this.setStyle({
                        opacity: 1
                    });
                })
                .addTo(map);

          linkLayers[path] = {
            feature: feature,
            line: line,
            data: link
          }
        }
      });

    return null;
  }