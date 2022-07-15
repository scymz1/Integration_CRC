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

import "@elfalem/leaflet-curve";

import * as d3 from "d3"

import * as turf from "@turf/turf"

// import * as file from "./example_routes.json";

const { BaseLayer } = LayersControl;

// const json = require("./transatlantic_bezier_example.json")
// const json2 = require("./iam.json")

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



const center = [23.486678, -88.59375]


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

  const normal = `https://api.mapbox.com/styles/v1/alisonqiu/cl4t2jnz6003115mkh34qvveh/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`
  const noBorder = `https://api.mapbox.com/styles/v1/alisonqiu/cl4wvvno1004o15pygzcxghf7/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWxpc29ucWl1IiwiYSI6ImNsNHQyaThvazByaXozY28wazQ1bTlwd2wifQ.qOAlN-DL8JH6mXOzbRFdLw`


  const line = (coord1, coord2) => {

    const lengthX = coord2.x - coord1.x;
    const lengthY = coord2.y - coord1.y;
    
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };
  
  var smoothing_factor = 0.15

  const controlPoint = (
    smoothing,
    map,
    current,
    previous,
    next
  ) => {

    const p = previous || current;
    const n = next || current;

    console.log(L.latLng(p))

    const currPoint = map.latLngToLayerPoint(L.latLng(current));
    const prevPoint = map.latLngToLayerPoint(L.latLng(p));
    const nextPoint = map.latLngToLayerPoint(L.latLng(n));

    var l= line(prevPoint, nextPoint)

    l.length = l.length * smoothing

    const x = currPoint.x + Math.cos(l.angle) * l.angle;
    const y = currPoint.y + Math.sin(l.length) * l.length;

    const { lat, lng } = map.layerPointToLatLng([x, y]);

    return [lat, lng]
  }
  
  function drawCurve (map, points) {
    const first = points[0]
    var pl = points.length;

    const controlPoints = [];

    for (let i = 0; i < pl; i++) {
      controlPoints.push(
        controlPoint(
          smoothing_factor,
          map,
          points[i],
          points[i + 1],
          points[i - 1]
        )
      );
      controlPoints.push(
        controlPoint(
          smoothing_factor,
          map,
          points[i],
          points[i - 1],
          points[i + 1]
        )
      );
    }

     /* Remove first (and last) control points for open shapes */
     controlPoints.shift();
     /* Push one last control point just before the last reference point, has no 'next' */
     controlPoints.push(
       controlPoint(
        smoothing_factor,
         map,
         points[pl - 1],
         undefined,
         points[pl - 2]
       )
     );

    //  const commands = ["M", [first.lat, first.lng]]; // Begin with placing pen at first point 
     const commands = ["M", [first[0], first[1]]]; // Begin with placing pen at first point 
     
     const commands1 = ["M", [first[0], first[1]]];
     const commands2 = ["M", [first[0], first[1]]];

     var cp1 = controlPoints.shift();
     var cp2 = controlPoints.shift();
     var destination = points.shift();
     commands.push(...(["Q", cp1, [destination[0], destination[1]]]));
     commands1.push(...(["Q", cp1, [destination[0], destination[1]]]));
     commands2.push(...(["C", cp1, cp2 [destination[0], destination[1]]]));

     while (points.length > 0) {
       cp1 = controlPoints.shift();
       cp2 = controlPoints.shift();

      destination = points.shift();
      console.log("Destination: ", destination)
      // commands.push(...(["C", cp1, cp2, [destination.lat, destination.lng]]));
      commands.push(...(["Q", cp1, [destination[0], destination[1]]]));
      commands1.push(...(["S", cp1, [destination[0], destination[1]]]));
      commands2.push(...(["C", cp1, cp2 [destination[0], destination[1]]]));
      // commands.push(...(["T", [destination[0], destination[1]]]));
    }

    console.log("Command: ", commands)
    L.curve(commands, {color: 'red', weight: 1}).addTo(map)
    L.curve(commands1, {color: 'blue', weight: 1}).addTo(map)
    L.curve(commands2, {color: 'yellow', weight: 1}).addTo(map)
  }


  function draw(map, route) {

    var weight = route[0]

    var commands = []
    commands = ["M", route[1]]

    L.marker(route[1]).addTo(map)

    commands.push("Q", route[2][0], route[2][1])
    L.marker(route[2][1]).addTo(map)

    for(var i = 3; i < route.length; i++) {
      commands.push("C", route[i][0], route[i][1], route[i][2])
      // L.marker(route[i][0]).bindPopup(route[i][0].toString()).addTo(map)
      L.marker(route[i][2]).addTo(map)
    }

    console.log("Commands: ", commands)

    L.curve(commands, {color:'blue', weight: weight*0.1}).addTo(map);
  }


  function testDraw(map) {
    var test = [
      [9.343897, 0.054033], [0.5932511, 8.3935547], [1.2303742, 2.2851563], [3.6614458, -0.9942627], [3.4476247, -8.5913086], [0.5712796, -14.0625]
    ]

    test.map(p => {
      L.marker(p).bindPopup(p.toString()).addTo(map)
    })

    drawCurve(map, test)
  }

  
  function turf_draw(map) {

    
    // const curve = [
    //   [-75.29225158691406, 37.805715207044685],
    //   [-77.27886199951173, 37.81086891407298 ],
    //   [-76, 40.80625771945958 ], 
    //   [-78.26581573486328, 36.79825525720401 ],
    //   [-77.27989196777344, 37.802595683318046 ],
    //   ]

    // var line = turf.lineString(curve);

    // // calculate the bezier curves
    // var curved = turf.bezier(line);

        // curve.map(c => {
        //   console.log(c)
        //   var point = turf.point(c)
        //   L.geoJson(point).addTo(map)
        // })
        // L.geoJson(curved, {color:"blue"}).addTo(map);

        // json.routes.map(route => {
        //   if(route.length > 1) {
        //     // console.log("Routes: ", route)
        //     var line = turf.lineString(route);
        //     var curved = turf.bezier(line);
        //     L.geoJson(curved, {color:"blue", weight:1}).addTo(map);
        //   } 
        // })

        // json.points.map(point => {
        //   var p = turf.point(point)
        //   L.geoJson(p).addTo(map)
        // })
  }

  function MyComponent() {
    
    const map = useMapEvents({
      click: (e) => {

        // var valueMin = d3.min(json.routes, function (l) {
        //   return l.weight
        // });
        // var valueMax = d3.max(json.routes, function (l) {
        //   return l.weight
        // });
      
        // var valueScale = d3.scaleLinear().domain([valueMin, valueMax]).range([1, 10]);


        var python_test = [100,[18.46667, -69.9], [[19.27755926, -70.79080074], [17.6806616, -68.9172363]], [[16.08376394, -67.04367186], [14.913478690000002, -67.0001221], [13.1436778, -63.6547852]], [[11.37387691, -60.3094483], [12.27396157, -61.19384769], [11.7813253, -57.7661133]], [[11.28868903, -54.33837891], [12.006353460000001, -55.84790039], [11.5015569, -52.2290039]], [[10.99676034, -48.610107410000005], [11.19665261, -48.75512694], [10.0986701, -45.703125]], [[9.00068759, -42.65112306], [9.25203421, -44.7978516], [7.8416152, -42.0556641]], [[6.43119619, -39.3134766], [7.04463355, -39.858398460000004], [5.3972734, -36.5625]], [[3.7499132500000005, -33.266601539999996], [2.14053878, -35.03759763], [2.3504147, -31.0693359]], [[2.56029062, -27.101074169999997], [4.03230957, -27.36914058], [6.0968598, -23.3349609]], [[8.161410029999999, -19.300781219999998], [7.3850684300000005, -18.86132809], [9.2322488, -17.6220703]], [[11.079429170000001, -16.38281251], [10.29881356, -18.41308596], [12.2541277, -19.2041016]], [[14.20944184, -19.995117240000003], [14.67901111, -20.91632085], [15.7499626, -20.2587891]], [[16.820914090000002, -19.60125735], [15.93395578, -18.054966829999998], [15.823966, -17.0123291]], [[15.713976220000001, -15.96969137], [15.515520800000001, -16.852029729999998], [15.38333, -16.78333]]]
       
        var python_test_array = [
          [100,[18.46667, -69.9], [[19.27755926, -70.79080074], [17.6806616, -68.9172363]], [[16.08376394, -67.04367186], [14.913478690000002, -67.0001221], [13.1436778, -63.6547852]], [[11.37387691, -60.3094483], [12.27396157, -61.19384769], [11.7813253, -57.7661133]], [[11.28868903, -54.33837891], [12.006353460000001, -55.84790039], [11.5015569, -52.2290039]], [[10.99676034, -48.610107410000005], [11.19665261, -48.75512694], [10.0986701, -45.703125]], [[9.00068759, -42.65112306], [9.25203421, -44.7978516], [7.8416152, -42.0556641]], [[6.43119619, -39.3134766], [7.04463355, -39.858398460000004], [5.3972734, -36.5625]], [[3.7499132500000005, -33.266601539999996], [2.14053878, -35.03759763], [2.3504147, -31.0693359]], [[2.56029062, -27.101074169999997], [4.03230957, -27.36914058], [6.0968598, -23.3349609]], [[8.161410029999999, -19.300781219999998], [7.3850684300000005, -18.86132809], [9.2322488, -17.6220703]], [[11.079429170000001, -16.38281251], [10.29881356, -18.41308596], [12.2541277, -19.2041016]], [[14.20944184, -19.995117240000003], [14.67901111, -20.91632085], [15.7499626, -20.2587891]], [[16.820914090000002, -19.60125735], [15.93395578, -18.054966829999998], [15.823966, -17.0123291]], [[15.713976220000001, -15.96969137], [15.515520800000001, -16.852029729999998], [15.38333, -16.78333]]],

          [10,[16.1018, -22.93875], [[16.24109012, -23.798373069999997], [16.1355389, -22.9943848]], [[16.02998768, -22.19039653], [16.91438596, -21.39587406], [15.7499626, -20.2587891]], [[14.58553924, -19.121704140000002], [14.20944184, -19.995117240000003], [12.2541277, -19.2041016]], [[10.29881356, -18.41308596], [11.079429170000001, -16.38281251], [9.2322488, -17.6220703]], [[7.3850684300000005, -18.86132809], [8.161410029999999, -19.300781219999998], [6.0968598, -23.3349609]], [[4.032309570000001, -27.36914058], [2.56029062, -27.101074169999997], [2.3504147, -31.0693359]], [[2.14053878, -35.03759763], [3.7499132500000005, -33.266601539999996], [5.3972734, -36.5625]], [[7.04463355, -39.858398460000004], [6.43119619, -39.3134766], [7.8416152, -42.0556641]], [[9.25203421, -44.7978516], [9.00068759, -42.65112306], [10.0986701, -45.703125]], [[11.19665261, -48.75512694], [10.99676034, -48.610107410000005], [11.5015569, -52.2290039]], [[12.006353460000001, -55.84790039], [11.28868903, -54.33837891], [11.7813253, -57.7661133]], [[12.27396157, -61.19384769], [12.641954230000001, -59.86450201], [13.1436778, -63.6547852]], [[13.64540137, -67.44506838999999], [13.825346960000001, -67.44396970999999], [13.4537372, -70.4003906]], [[13.08212744, -73.35681149], [12.901764720000001, -71.611084], [11.9049786, -73.5095215]], [[10.908192479999999, -75.407959], [9.51599269, -73.86437987], [10.1311168, -76.7285156]], [[10.74624091, -79.59265133], [12.08919697, -81.13183588999999], [13.9553923, -83.0566406]], [[15.82158763, -84.98144531], [15.179261459999998, -82.45733648], [16.3517679, -83.1445313]], [[17.524274339999998, -83.83172612], [17.847936320000002, -83.94982906999999], [17.8637471, -85.34729]], [[17.87955788, -86.74475093000001], [17.032508229999998, -87.3693511], [16.4044705, -87.8027344]], [[15.77643277, -88.23611770000001], [15.96054275, -87.09515102], [15.770288, -86.791901]]]

        ]

        python_test_array.map(array=> {
          console.log(array)
          draw(map, array)
        })
        // draw(map, python_test)

        // drawCurve(map, json.routes[0])
        // draw(map, json.routes[0])
        // testDraw(map)
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

        <MyComponent/>
        {/* <ReadFeature search_object={search_object}/> */}

        <AreaSelect onChangelongitude1={onChangelongitude1} onChangelongitude2={onChangelongitude2}
                  onChangelatitude1={onChangelatitude1} onChangelatitude2={onChangelatitude2}  />

      </MapContainer>
    </div>
  );
};

// };
export default Map;