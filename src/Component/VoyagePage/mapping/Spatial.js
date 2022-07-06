// The Spatial.js is a component to read a csv file and a Geojson file and draw the geosankey diagram on the map.
// References: https://github.com/geodesign/spatialsankey, https://github.com/UNFPAmaldives/migration

import { useMapEvents, GeoJSON } from "react-leaflet";
import L from "leaflet";
import * as d3 from "d3";

// import nodes2 from "./voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_voyage_itinerary__imp_broad_region_slave_dis__geo_location__id_Barbados_1800_1810_1_1";
// import csv2 from "./voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_voyage_itinerary__imp_broad_region_slave_dis__geo_location__id_Barbados_1800_1810_1_1.csv"

import nodes2 from "./voyage_itinerary__imp_port_voyage_begin__geo_location__id_voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_Barbados_Jamaica_1700_1860_0_0";
import csv2 from "./voyage_itinerary__imp_port_voyage_begin__geo_location__id_voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_Barbados_Jamaica_1700_1860_0_0.csv"

var nodeLayers = {};
var linkLayers = {};
var selectedNode = null;


  // Drawing nodes and links on the map
  export function ReadFeature() {

    // Function for distinguish if the feature is a waypoint
    const featureWayPt = (feature) => {
        return !feature.properties.name.includes("ocean waypt");
    }

    const map = useMapEvents( {
      click: (e) => {
        
          var markers = L.markerClusterGroup();
          // Add all features (including waypoints to nodeslayers)
          L.geoJSON(nodes2.features, {

            onEachFeature: function (feature, layer) {

                nodeLayers[feature.id] = {
                  layer: layer,
                  // center: layer.getBounds().getCenter()
                }
            }
          });
          
          // Add only actual locations to the map (with clicking events and popups)
          var nodeLayer = L.geoJSON(nodes2.features, {
              filter: featureWayPt,
            
              onEachFeature: function (feature, layer) {
              
                layer
                  .on('click', function(e) {
                    layer.closePopup();
      
                    for(var linkPath in linkLayers) {
                      var path = linkPath.split('-');
      
                      // when click on a node, show only the links that attach to it
                      if (selectedNode != null && selectedNode != path[0]) {
                        map.addLayer(linkLayers[linkPath].feature);
                      }
                    }
      
                    if (selectedNode == null || selectedNode != feature.id) {
                      
                      for (var linkPath in linkLayers) {
                        var path = linkPath.split('-');
      
                        if (feature.id != path[0] && feature.id != path[1]) {
                            map.removeLayer(linkLayers[linkPath].feature);
                        }
                        else {
                            // num += parseInt(linkLayers[linkPath].data.value);
                        }
                      }
      
                      selectedNode = feature.id;
                    }
                    else {    
                      selectedNode = null;
                    }
                  });
  
                  layer.bindPopup(layer.feature.properties.name)
                  markers.addLayer(layer);
              }
              
            });
            map.addLayer(markers)
        DrawLink(map);
      }
    });

    return null;
  }

  // Function to draw the links
  function DrawLink(map) {
  
    var links = [];

    d3.csv(csv2, function(data){
      links = [...links, data]
    }).then(function() {


      var valueMin = d3.min(links, function(l) { console.log("Flow: ", l.flow); return (l.source != l.target) ? parseInt(l.flow) : null; });
      var valueMax = d3.max(links, function(l) { return (l.source != l.target) ? parseInt(l.flow) : null; });

      var valueScale = d3.scaleLinear()
                            .domain([valueMin, valueMax])
                            .range([1, 20]);

      links.forEach(function (link) {
        if (link.source != link.target) {
          var path = [link.source, link.target].join('-');
          var pathReverse = [link.target, link.source].join('-');

          var lineWeight = valueScale(link.flow);

          
          var lineCenterLatLng = L.polyline([ nodeLayers[link.source].layer._latlng, nodeLayers[link.target].layer._latlng ])
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
                nodeLayers[link.source].layer._latlng, 
                lineBreakLatLng, 
                nodeLayers[link.target].layer._latlng
            ], {
              weight: lineWeight
            });

            var feature = L.featureGroup([line])
                .bindPopup('<p3>' + link.source + '</p3> to <p3>' + link.target + '</p3>' + '<br>' + '<p4>' + link.flow + ' migrants' + '</p4>')
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
    })
    // });
    return null;
  }