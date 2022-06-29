import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer,FeatureGroup,Marker, Popup,useMapEvents,LayersControl, useMap, GeoJSON} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "./Style.css"
import RoutineMachine from "./RoutineMachine";
import "leaflet/dist/leaflet.css";
//import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import * as d3 from "d3";
// import nodes from "./voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_voyage_itinerary__imp_broad_region_slave_dis__geo_location__id_Barbados_1800_1810_0_0";
import nodes from "./voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_voyage_itinerary__imp_broad_region_slave_dis__geo_location__id_Bahamas_New York_1715_1780_1_1";
import csv from './voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_voyage_itinerary__imp_broad_region_slave_dis__geo_location__id_Barbados_1800_1810_0_0.csv'; 
import { createSvgIcon } from "@mui/material";

import * as d3spatialsankey from "./spatialsankey";
import 'leaflet.markercluster';
const { BaseLayer } = LayersControl;

//https://github.com/tomik23/react-leaflet-examples/tree/main/src/pages
//pass location to routing https://codesandbox.io/s/react-leaflet-v3-how-to-dynamicallly-pass-the-routing-coordinates-to-leaflet-routing-using-react-hooks-852ji?file=/src/App.js

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});



const points1 = [
  [52.22977, 21.01178],
  [52.22977, 21.01178]
];

const points2 = [
  [33.53001088075479, 36.26829385757446],
  [33.50546582848033, 36.29547681726967]
];


const center = [23.486678, -88.59375]


const locations = [
  { name: "Cuba", position: [21.82801, -78.354492],  info: "lalala" },
  { name: "Gulf of Mexico", position: [25.148824, -89.67041],  info: "lalala" },
  { name: "Georgia", position: [32.761929, -83.232422], info: "lalala" },
];

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png"
});

const file = "voyage_itinerary__imp_principal_region_of_slave_purchase__geo_location__id_voyage_itinerary__imp_broad_region_slave_dis__geo_location__id_Barbados_1800_1810_0_0.csv"
// var links = csvFileToArray(file);
// const light = 'cl4t2jnz6003115mkh34qvveh'
// const noBorder = 'cl4t3r3s9001216nwr2pj50n3' 


const Map = () => {
  const rMachine = useRef();
  const [points, setPoints] = useState(true);

  // const [locations, setLocations] = useState([[1.35735, 103.7], [1.35735, 103.94], [1.4, 103.8]]);
  const [links, setArray] = useState([]);

  const loadCsv = () => {
    d3.csv(csv, function(data){
     
      console.log("CSV Data: ", data);
      setArray(links => [...links, data])
      console.log("Links:", links)
    })
  }

 

  // const light = 'cl4t2jnz6003115mkh34qvveh'
  // const noBorder = 'cl4t3r3s9001216nwr2pj50n3'
  const normal = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
  const noBorder = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

  const handleClick = () => {
    setPoints(!points)
}

  
  //const pointsToUse = points ? [[1.3575, 104.7],[1.3535, 103.34]] : points2;
  const pointsToUse = points ? [[30.751942, -82.2216],[15.311785, -85.627441]] : points2;
  

  function MyComponent() {

    const [layerInfo, setLayer] = useState(null);

    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        
        var markers = L.markerClusterGroup();

        console.log('new marker at ', e.latlng)
        // L.marker([lat, lng], { icon }).addTo(map);
        console.log("Nodes ", nodes.features)        
        markers.addLayer(L.geoJSON(nodes.features, {
          onEachFeature : function(feature, layer){
              console.log("Feature: ", feature);
              console.log("Layer: ", layer);

              layer.bindPopup(function (layer) {                                // adding popup to port / link
                                // console.log(layer.feature);
                                if(layer.feature.properties.name)
                                  return layer.feature.properties.name;
                                else
                                  return layer.feature.geometry.type;
                              });
          }
        }));
        map.addLayer(markers);
        
        markers.addTo(map);

        // L.geoJSON(nodes.features).bindPopup(function (layer) {
        //                                       console.log(layer.feature);
        //                                       return layer.feature.properties.name;
        //                                     }).addTo(map);

      },

    });
    return null;
  }

  const customPopup = (
    <iframe
      width="auto"
      title="Marek Grechuta"
      height="310"
      src="https://www.youtube.com/embed/glKDhBuoRUs"
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
  

  useEffect(() => {
    if (rMachine.current) {
      console.log("New Points to use: ", rMachine.current);
      rMachine.current.setWaypoints(pointsToUse);
    }
    console.log("Points to use: ", pointsToUse)
  }, [pointsToUse, rMachine]);

  const onClickFeature = (feature, layer) => {
      console.log(feature);
      layer.bindPopup(function (layer) {                                // adding popup to port / link
        // console.log(layer.feature);
        if(layer.feature.properties.name)
          return layer.feature.properties.name;
        else
          return layer.feature.geometry.type;
      });

      layer.on({
        click: (event) => {
          event.target.setStyle(
            {
              color: "green"
            }
          );
        }
      });
  }

  return (
    
    <MapContainer
      id="mapId"
      center={center}
      zoom={5}
      scrollWheelZoom={false}
    >
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=' &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors"'
      /> */}  
     
      <button>Example</button>
      <LayersControl position="bottomleft">
            <BaseLayer name="modern country border">
            <TileLayer
              url={normal}
              attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
            /> 
            </BaseLayer>
            <BaseLayer checked name="no country border">
            <TileLayer
              url={noBorder}
              attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
            />
            </BaseLayer>
      </LayersControl>


      {locations.map((location) => (
        <Marker
          position={location.position}
          draggable= {true}
        >
          {console.log(location.position)}
          <Popup>
            {location.name} - {location.info}
            {/* can be replaced with pivot table */}
            {/* {customPopup} */}
          </Popup>
        </Marker>
      ))}

      <GeoJSON data={nodes.features} onEachFeature={onClickFeature}/>

      {/* <MyComponent/> */}

      {console.log("Points to use: ", pointsToUse)}
      <RoutineMachine ref={rMachine} waypoints={pointsToUse} />

    </MapContainer>
  );
};

export default Map;


 // function GeoSankey() {
  //   loadCsv();
    
  //   const map = useMap();
    
  //   map._initPathRoot();

  //   var svg = d3.select(node).append("svg"),
  //       linklayer = svg.append("g"),
  //       nodelayer = svg.append("g");

  //   var nodelinks = spatialsankey.links();

  //   var node = document.createElement('div');
  //   var spatialsankey = d3spatialsankey()
  //                           .lmap(map)
  //                           .nodes(nodes.features)
  //                           .links(links);
      
  //   var node = spatialsankey.node();
  //   var circs = nodelayer.selectAll("circle")
  //                         .data(spatialsankey.nodes())
  //                         .enter()
  //                         .append("circle")
  //                         .attr("cx", node.cx)
  //                         .attr("cy", node.cy)
  //                         .attr("r", node.r)
  //                         .style("fill", node.fill);   
                          
  //   var link = spatialsankey.link();
  //   var beziers = linklayer.selectAll("path")
  //                         .data(nodelinks)
  //                         .enter()
  //                         .append("path")
  //                         .attr("d", link)
  //                         .attr('id', function(d){return d.id})
  //                         .style("stroke-width", link.width())
  //                         .style("fill", 'none');
  // }