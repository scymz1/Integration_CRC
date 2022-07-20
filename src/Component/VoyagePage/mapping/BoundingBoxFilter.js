import React, { useState, useEffect } from 'react'
import {MapContainer, TileLayer, LayersControl} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

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

export default function BoundingBoxFilter(props){

    const [radioOptions, onChangeRadioOption] = React.useState("embarkation");
   
    
    const [longitude1, onChangelongitude1] = React.useState(-360);
    const [longitude2, onChangelongitude2] = React.useState(359.99);
    const [latitude1, onChangelatitude1] = React.useState(-90);
    const [latitude2, onChangelatitude2] = React.useState(90);

    
    const {set_search_object, search_object} = React.useContext(props.context);
    
    //const [map_search_object, set_map_search_object] = useState(search_object);

    const [selectMode, SetselectMode] = useState(false);
    
    const handle = useFullScreenHandle();

    useEffect(() => {
        var out;
        if(radioOptions=="embarkation"){
            let newObject = { ...search_object };
            out = "embarkation***<class 'rest_framework.fields.Map'>***Map embarkation filter";

            delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude"];
            delete newObject["voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude"];
            //set_search_object(newObject);
            set_search_object({
                ...newObject,
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude": [latitude1, latitude2],
                "voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude": [longitude1, longitude2]
            });
        }
        else{
            let newObject = { ...search_object };
            out = "disembarkation***<class 'rest_framework.fields.Map'>***Map disembarkation filter";

            delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__latitude"];
            delete newObject["voyage_itinerary__imp_principal_place_of_slave_purchase__geo_location__longitude"];

            console.log("New OBject: ", newObject)
            //set_search_object(newObject);
            set_search_object({
                ...newObject,
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__latitude": [latitude1, latitude2],
                "voyage_itinerary__imp_principal_port_slave_dis__geo_location__longitude": [longitude1, longitude2]
            });
        }
        
    }, [longitude1, longitude2, latitude1, latitude2, radioOptions]);
  
    const position = [0, -20];
    
    const normal = `https://api.mapbox.com/styles/v1/jcm10/cl2gmkgjt000014rstx5nmcj6/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`

    const noBorder = `https://api.mapbox.com/styles/v1/jcm10/cl2glcidk000k14nxnr44tu0o/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiamNtMTAiLCJhIjoiY2wyOTcyNjJsMGY5dTNwbjdscnljcGd0byJ9.kZvEfo7ywl2yLbztc_SSjw`

    const normal_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`

    const noBorder_old = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`


    const SwitchBoundingBoxSelection = (event) => {
        if(radioOptions=="embarkation"){
            onChangeRadioOption("disembarkation");
        }
        else{
            onChangeRadioOption("embarkation");
        }
        SetselectMode(true);
    }

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <Button style={{background:"white", width: "100%"}} onClick={SwitchBoundingBoxSelection}> 
                    Select Disembarkation
            </Button>
            <Button style={{background:"white", width: "100%"}} onClick={SwitchBoundingBoxSelection}> 
                Select Embarkation
            </Button>
            <MapContainer center={position} zoom={2.5} minZoom={2.2} style={{ height: "75vh", width: "100vh", zIndex: 0}}>
                <LayersControl position="bottomleft">
                    <BaseLayer name="modern country border (old map)">
                        <TileLayer
                            url={normal_old}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        /> 
                    </BaseLayer>
                    <BaseLayer checked name="no country border (old map)">
                        <TileLayer
                            url={noBorder_old}
                            attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
                        />
                    </BaseLayer>
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
                <ReadFeature search_object={search_object}  radio = {radioOptions}/>

                <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2} selectMode={selectMode} SetselectMode={SetselectMode}/>

            </MapContainer>
        </div>      
    );
}