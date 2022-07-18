import React, { useState, useEffect } from 'react'
import {MapContainer, TileLayer, LayersControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


import Control from 'react-leaflet-custom-control';
import { Button } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

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

function FullscreenButton(props){
    // const context = useLeafletContext();
    // const control = new Control({position: 'topright'});
    // control.onAdd = function (map) {
    //     let div = DomUtil.create('button');
    //     div.innerHtml = `Enter fullscreen`  //`<button onClick={props.fullscreen}>Enter fullscreen</button>`
    //     return div;
    // }
    // useEffect(()=>{
        
    //     const container = context.layerContainer || context.map;
    //     container.addControl(control);
    // }, []);
    // var map = useMap();
    // L.easyButton('fa-globe', function(btn, map){
    // }).addTo( map );

    // return null;
}

export default function MapBoundingBox(props){

    const [radioOptions, onChangeRadioOption] = React.useState("embarkation");
    
    const [longitude1, onChangelongitude1] = React.useState(-360);
    const [longitude2, onChangelongitude2] = React.useState(359.99);
    const [latitude1, onChangelatitude1] = React.useState(-90);
    const [latitude2, onChangelatitude2] = React.useState(90);

    
    const {search_object, endpoint} = React.useContext(props.context);
    
    const [map_search_object, set_map_search_object] = useState(search_object);
    
    const handle = useFullScreenHandle();

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
  
    const position = [0, 0];

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

        <br/>

        <FormControl>
        <FormLabel id="optionFilter">Component Option Choice </FormLabel>
        <RadioGroup
            row
            aria-labelledby="optionFilter"
            defaultValue= "Both"
            name="radio-buttons-group"
        >
            <FormControlLabel value="Map" control={<Radio />} label="Map" />
            <FormControlLabel value="Sankey" control={<Radio />} label="Sankey" />
            <FormControlLabel value="Both" control={<Radio />} label="Both" />
        </RadioGroup>
        </FormControl>

             
            <FullScreen handle={handle}>
            <MapContainer center={position} zoom={3} minZoom={2.2} style={{ height: "100vh" }}>
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
                <ReadFeature search_object={map_search_object} set_search = {set_map_search_object} radio = {radioOptions}/>
                <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2}  />
                {
                    handle.active?
                        <Control prepend position='topleft' >
                            <Button style={{background:"white", width: "100%"}} onClick={handle.exit}> 
                            <FullscreenExitIcon style={{width:"100%"}} />
                            </Button>
                        </Control>
                        :
                        <Control prepend position='topleft' >
                            <Button style={{background:"white", width: "100%"}} onClick={handle.enter}> 
                            <FullscreenIcon style={{width:"100%"}} />
                            </Button>
                        </Control>
                }

            </MapContainer>
            </FullScreen>
            {/* <p>longitude1: {longitude1}</p>
            <p>longitude2: {longitude2}</p>
            <p>latitude1: {latitude1}</p>
            <p>latitude2: {latitude2}</p> */}
        </div>
      
    );

}


