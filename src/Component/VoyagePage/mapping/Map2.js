import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer,FeatureGroup,Marker, Popup, useMapEvents, useMap } from "react-leaflet";
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

const center = [1.35, 103.8];

const locations = [
  {position: [1.35735, 103.7]},
  {position: [1.35735, 103.94],},
  {position: [1.4, 103.8],},
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

const Map = () => {
  const rMachine = useRef();
  const [points, setPoints] = useState(true);
  const pointsToUse = points ? [[1.35735, 103.7],[1.35735, 103.94], [1.4, 103.8]] : points2;

  const [locations, setLocations] = useState([[1.35735, 103.7], [1.35735, 103.94], [1.4, 103.8]]);
  const [links, setArray] = useState([]);

  const loadCsv = () => {
    d3.csv(csv, function(data){
     
      console.log("CSV Data: ", data);
      setArray(links => [...links, data])
      console.log("Links:", links)
    })
  }

  function GeoSankey() {
    loadCsv();
    
    const map = useMap();
    
    map._initPathRoot();

    var svg = d3.select(node).append("svg"),
        linklayer = svg.append("g"),
        nodelayer = svg.append("g");

    var nodelinks = spatialsankey.links();

    var node = document.createElement('div');
    var spatialsankey = d3spatialsankey()
                            .lmap(map)
                            .nodes(nodes.features)
                            .links(links);
      
    var node = spatialsankey.node();
    var circs = nodelayer.selectAll("circle")
                          .data(spatialsankey.nodes())
                          .enter()
                          .append("circle")
                          .attr("cx", node.cx)
                          .attr("cy", node.cy)
                          .attr("r", node.r)
                          .style("fill", node.fill);   
                          
    var link = spatialsankey.link();
    var beziers = linklayer.selectAll("path")
                          .data(nodelinks)
                          .enter()
                          .append("path")
                          .attr("d", link)
                          .attr('id', function(d){return d.id})
                          .style("stroke-width", link.width())
                          .style("fill", 'none');
  }


  function MyComponent() {

    console.log("breakpoint 2")

    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        
        var markers = L.markerClusterGroup();

        console.log('new marker at ', e.latlng)
        // L.marker([lat, lng], { icon }).addTo(map);
        console.log("Nodes ", nodes.features)
        // L.geoJSON(nodes.features).addTo(map);

        markers.addLayer(L.marker([lat, lng], { icon }));
        // markers.addLayer(L.geoJSON(nodes.features));
        map.addLayer(markers);
        
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
  

  const handleClick = () => {
    setPoints(!points)
    console.log(rMachine)
}

  useEffect(() => {
    if (rMachine.current) {
      console.log("New Points to use: ", rMachine.current);
      rMachine.current.setWaypoints(pointsToUse);
    }
    console.log("Points to use: ", pointsToUse)
  }, [pointsToUse, rMachine]);

  return (
    // <div>

    
    <MapContainer
      id="mapId"
      center={center}
      zoom={10}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution=' &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors"'
      />

      {locations.map((location) => (
        <Marker
          // position={location.position}
          position={location}
          draggable= {true}
          eventHandlers={{
            click: () => {
              console.log('marker clicked')
            },
          }}
        >
          {/* {console.log(location.position)} */}
          <Popup>
            {/* {location.name} - {location.position} */}
            {location}
            {/* can be replaced with pivot table */}
            {/* {customPopup} */}
          </Popup>
        </Marker>
      ))}

      <MyComponent/>

      {console.log("Points to use: ", pointsToUse)}
      <RoutineMachine ref={rMachine} waypoints={pointsToUse} />
      <button onClick={handleClick}>
        Toggle Points State and Props
      </button>
    </MapContainer>

    // {/* <button onClick={loadCsv}>
    //   Parse CSV
    // </button> */}
    // </div>
  );
};

export default Map;
