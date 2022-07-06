import React, { useEffect } from 'react'
import 'leaflet'
import {MapContainer, TileLayer, LayersControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import axios from 'axios';

const { BaseLayer } = LayersControl;
//+ '?hierarchical=false'
const location_url = '/voyage/aggroutes' 

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default function MapBoundingBox(){


    const [longitude1, onChangelongitude1] = React.useState(0);
    const [longitude2, onChangelongitude2] = React.useState(0);
    const [latitude1, onChangelatitude1] = React.useState(0);
    const [latitude2, onChangelatitude2] = React.useState(0);

    const [latitude_var_name, setLatitude_Name] = React.useState("voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude");
    const [longitude_var_name, setLongitude_Name] = React.useState("voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude");

    const position = [23.486678, -88.59375];

    const normal = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
    const noBorder = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
  

    useEffect(() => {
        var data = new FormData();
        data.append(latitude_var_name, latitude1);
        data.append(latitude_var_name, latitude2);
        data.append(longitude_var_name, longitude1);
        data.append(longitude_var_name, longitude2);

        axios.post('/voyage/', data=data)
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
            <MapContainer center={position} zoom={5} style={{ height: "100vh" }}>
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


                {/* <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                /> */}
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


