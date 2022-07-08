import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer,FeatureGroup,Marker, Popup,useMapEvents,LayersControl, useMap, GeoJSON} from "react-leaflet";
import "./Style.css"
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import { ReadFeature } from "./Spatial.js"
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
// var edges = csvFileToArray(file);
// const light = 'cl4t2jnz6003115mkh34qvveh'
// const noBorder = 'cl4t3r3s9001216nwr2pj50n3' 


const Map = () => {
  const rMachine = useRef();
  const [points, setPoints] = useState(true);

  const [longitude1, onChangelongitude1] = React.useState(0);
  const [longitude2, onChangelongitude2] = React.useState(359);
  const [latitude1, onChangelatitude1] = React.useState(-90);
  const [latitude2, onChangelatitude2] = React.useState(90);

  const [radioOptions, onChangeRadioOption] = React.useState("embarkation");

  const getRadioValue = (event) => {
    onChangeRadioOption(event.target.value);
    console.log(radioOptions);
  }

  const [search_object, set_search_object] = useState({});

  useEffect(() => {
    if(radioOptions=="embarkation"){
      set_search_object({
        "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
        "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
      });
    }
    else{
      set_search_object({
        "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
        "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
      });
    }
  }, [longitude1, longitude2, latitude1, latitude2, radioOptions]);

  // const light = 'cl4t2jnz6003115mkh34qvveh'
  // const noBorder = 'cl4t3r3s9001216nwr2pj50n3'
  const normal = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
  const noBorder = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

  const handleClick = () => {
    setPoints(!points)
}

  

  // function MyComponent() {
    
  //   const map = useMapEvents({
  //     click: (e) => {

  //       const { lat, lng } = e.latlng;
  //       //add new markers
  //       var marker = L.marker([lat, lng], { icon })


  //       //Jason's routing
  //       var markers = L.markerClusterGroup();
  //       // L.marker([lat, lng], { icon }).addTo(map);

  //       markers.addLayer(L.geoJSON(nodes2.features, {
  //         onEachFeature : function(feature, layer){
  //             // console.log("Feature: ", feature);
  //             // console.log("Layer: ", layer);

  //             layer.bindPopup(function (layer) {                                // adding popup to port / link
  //                               if(layer.feature.properties.name)
  //                                 return layer.feature.properties.name;
  //                               else
  //                                 return layer.feature.geometry.type;
  //                             });
  //         }
  //       }));
  //       map.addLayer(markers);
        
  //       marker.addTo(map);
  //       markers.addTo(map);

  //       // L.geoJSON(nodes.features).bindPopup(function (layer) {
  //       //                                       console.log(layer.feature);
  //       //                                       return layer.feature.properties.name;
  //       //                                     }).addTo(map);

  //     },

  //   });
  //   return null;
  // }

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

  

  const onClickFeature = (feature, layer) => {
      layer.bindPopup(function (layer) {
        // adding popup to port / link
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
    <div>
      <FormControl>
        <FormLabel id="boundingBoxFilter">Bounding box select options</FormLabel>
        <RadioGroup
            row
            aria-labelledby="boundingBoxFilter"
            defaultValue="embarkation"
            name="radio-buttons-group"
            onChange={getRadioValue}
        >
            <FormControlLabel value="embarkation" control={<Radio />} label="embarkation" />
            <FormControlLabel value="disembarkation" control={<Radio />} label="disembarkation" />
        </RadioGroup>
        </FormControl>
      <MapContainer
        id="mapId"
        center={center}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100vh" }}
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


        {/* {locations.map((location) => (
        <Marker
          position={location.position}
          draggable= {true}
        >
          <Popup>
            pop up
            {location.name} - {location.info} 
            {customPopup}
           </Popup>
        </Marker>
      ))} */}

    {/* <MarkerClusterGroup> */}
    {/* <GeoJSON data={nodes.features} onEachFeature={onClickFeature}/> */}
    {/* </MarkerClusterGroup> */}

    
      {/* <MyComponent/> */}
        <ReadFeature search_object={search_object}/>

        <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                  onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2}  />

      </MapContainer>
    </div>
  );
};

// };
export default Map;