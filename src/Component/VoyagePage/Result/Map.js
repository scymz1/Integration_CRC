import React, { useState, useEffect } from 'react'
import 'leaflet'
import {MapContainer, TileLayer, LayersControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


import 'leaflet-area-select';
import AreaSelect from "./AreaSelect";
import axios from 'axios';
import { ReadFeature } from "../mapping/Spatial.js"

const { BaseLayer } = LayersControl;
//+ '?hierarchical=false'
const location_url = '/voyage/aggroutes' 

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

export default function MapBoundingBox(props){

    const [radioOptions, onChangeRadioOption] = React.useState("embarkation");
    
    const [longitude1, onChangelongitude1] = React.useState(0);
    const [longitude2, onChangelongitude2] = React.useState(359);
    const [latitude1, onChangelatitude1] = React.useState(-90);
    const [latitude2, onChangelatitude2] = React.useState(90);

    
    const {search_object, endpoint} = React.useContext(props.context);
    const [map_search_object, set_map_search_object] = useState(search_object);

    useEffect(() => {

        if(radioOptions=="embarkation"){
            set_map_search_object({
            ...search_object,
            "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
            "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
        });
        }
        else{
            set_map_search_object({
            ...search_object,
            "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
            "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
        });
        }
    }, [longitude1, longitude2, latitude1, latitude2, radioOptions, search_object]);
  
    const position = [23.486678, -88.59375];

    const normal = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
    const noBorder = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

    const getRadioValue = (event) => {
        onChangeRadioOption(event.target.value);
        console.log(radioOptions);
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
                <ReadFeature search_object={map_search_object}/>
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


