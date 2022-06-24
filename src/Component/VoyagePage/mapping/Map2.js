import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer,FeatureGroup,Marker, Popup,useMapEvents } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "./Style.css"
import RoutineMachine from "./RoutineMachine";
import "leaflet/dist/leaflet.css";
//import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";

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
  { name: "west", position: [1.35735, 103.7],  forecast: "cloudy" },
  { name: "east", position: [1.35735, 103.94],  forecast: "cloudy" },
  { name: "north", position: [1.4, 103.8], forecast: "heavy-rain" },
];

const icon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png"
});


const Map = () => {
  const rMachine = useRef();
  const [points, setPoints] = useState(true);
  const pointsToUse = points ? [[1.35735, 103.7],[1.35735, 103.94]] : points2;

  function MyComponent() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        console.log('new marker at '+e.latlng)
        L.marker([lat, lng], { icon }).addTo(map);
      }
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
      console.log(rMachine.current);
      rMachine.current.setWaypoints(pointsToUse);
    }
  }, [pointsToUse, rMachine]);

  return (
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
          position={location.position}
          draggable= {false}
        >
          <Popup>
            {location.name} - {location.forecast}
            {/* can be replaced with pivot table */}
            {customPopup}
          </Popup>
        </Marker>
      ))}

<MyComponent/>


      <RoutineMachine ref={rMachine} waypoints={pointsToUse} />
      <button onClick={handleClick}>
        Toggle Points State and Props
      </button>
    </MapContainer>
  );
};

export default Map;
