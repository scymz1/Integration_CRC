import React, { useEffect } from 'react'
import 'leaflet'
import {MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import axios from 'axios';

//+ '?hierarchical=false'
const location_url = '/voyage/geo/' 

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default function MapBoundingBox(){


    const [longitude1, onChangelongitude1] = React.useState(0);
    const [longitude2, onChangelongitude2] = React.useState(0);
    const [latitude1, onChangelatitude1] = React.useState(0);
    const [latitude2, onChangelatitude2] = React.useState(0);

    const position = [51.505, -0.09];

    useEffect(() => {
        var data = new FormData();
        data.append("latitude", latitude1);
        data.append("latitude", latitude2);
        data.append("longitude", longitude1);
        data.append("longitude", longitude2);

        axios.post('/geo/', data=data)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    [longitude1, longitude2, latitude1, latitude2]);

    return (
        <div>
            <MapContainer center={position} zoom={8} style={{ height: "100vh" }}>
                <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2}  />
            </MapContainer>
            <p>longitude1: {longitude1}</p>
            <p>longitude2: {longitude2}</p>
            <p>latitude1: {latitude1}</p>
            <p>latitude2: {latitude2}</p>
        </div>
      
    );

}


