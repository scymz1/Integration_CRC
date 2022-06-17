import * as React from 'react';
import { AppContext } from "./Filter";
import {GlobalContext} from "../../App";
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import axios from 'axios';
import "./Slider.css"
import {
    Typography,
    Slider,
    Chip, TextField
  } from '@mui/material';

import {ComponentContext} from "./ComponentFac"


const demoLabel = { inputProps: { 'aria-label': 'Checkbox demo' } };
const Input = styled(MuiInput)`
  width: 80px;
`;

function modifyName(rawName){
    const raw2 = rawName.replace(/ *\([^)]*\) */g, "")
    const res = raw2.split(":").length > 2 ?raw2.split(':').slice(1).join(':') : raw2;
    return res
}

export default function GetSlider() {
  const { index } = React.useContext(ComponentContext)
  console.log("INDEX: ", index)

    console.log("getSlider got called")
    const {setOutput, output, labels, setLabels} = React.useContext(AppContext)
    const {search_object, set_search_object} = React.useContext(GlobalContext)

    // const curLabel = labels[labels.length - 1];

    const curLabel = labels[index];

    // console.log("labels: ", labels);
    const varName = curLabel["option"];
    const varDisplay = modifyName(curLabel["label"])
    console.log("varName: ", varName);
    // console.log("varDisplay: ", varDisplay);

    // console.log("fetch from Provider completed")

    const [range, setRange] = React.useState([0,0])
    const [value, setValue] = React.useState([range[0]/2, range[1]/2])

    var d = new FormData();
    d.append('aggregate_fields', varName);
    //"voyage_slaves_numbers__imp_total_num_slaves_disembarked"
    const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
    
    const config =  {
        method: 'post',
        baseURL: 'https://voyages3-api.crc.rice.edu/voyage/aggregations',
        headers: {'Authorization': AUTH_TOKEN},
        data:d
    }

  React.useEffect(() => {
    axios(config).then(res => {
        setRange([Object.values(res.data)[0]['min'], Object.values(res.data)[0]['max']]);
        setValue([Object.values(res.data)[0]['min'], Object.values(res.data)[0]['max']]);
    }).then(console.log("HTTP resquest from Slider", config))
  }, [])

  function handleCommittedChange(event, newValue) {
    console.log("🚀 ~ file: Slider.js ~ line 71 ~ handleCommittedChange ~ handleCommittedChange", handleCommittedChange)
    //setValue(newValue); 
    set_search_object({                     // <---------- UPDATE SEARCH OBJECT
      ...search_object,
      [varName]: [value[0], value[1]]
    });
    console.log("73 SEARCH OBJECT injection -----> ", search_object)
    // console.log(varName, ": onchange", value);
  }
  
  const handleChange = (event, newValue) => {
      setValue(newValue); 
  };

  const handleInputChange = (event) => {
    const startVal = value[0]
    const endVal = value[1]
    var res = [0, 0]
    if(event.target.name === "end"){
      res = [startVal, Number(event.target.value)]
      // setValue([startVal, Number(event.target.value)])
    }else if(event.target.name === "start"){
      res = [Number(event.target.value), endVal]
      // setValue([Number(event.target.value), endVal])
    }
    // console.log("res", res)
    setValue(res)
  };

  const handleBlur = (event => {
    console.log("🚀 ~ file: Slider.js ~ line 122 ~ GetSlider ~ handleBlur", handleBlur)
    const curStart = value[0]
    const curEnd = value[1]
    // console.log(curStart, curEnd)
    // console.log(event.target.value)
    if (event.target.name === "end") {
      if(event.target.value > range[1]) setValue([curStart, range[1]]);
      if(event.target.value < curStart) setValue([curStart, curStart + 1 < range[1] ? curStart + 1 : range[1]]);
    } else if (event.target.name === "start") {
      if(event.target.value > curEnd) setValue([curEnd - 1 < range[0] ? range[0] : curEnd - 1 , curEnd]);
      if(event.target.value < range[0]) setValue([range[0], curEnd]);     
    }else{
      console.log("range selection legit", value)
    }

    set_search_object({                     // <---------- UPDATE SEARCH OBJECT
      ...search_object,
      [varName]: [value[0], value[1]]
    });
    console.log("116 SEARCH OBJECT injection -----> ", search_object)

  });



  return (
        <>
        {/* <Typography gutterBottom>{varDisplay}</Typography> */}
        <div class = "sliderInputs">
          <Input 
            color = "secondary"
            name ="start"
            value={value[0]}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: range[1] - range[0] > 20 ? 10 : 1,
              min: range[0],
              max: range[1],
              type: 'number',
              'aria-labelledby': 'input-slider',
              "position": "left"
            }}
          />
          <Input
            name ="end"
            value={value[1]}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: range[1] - range[0] > 20 ? 10 : 1,
              min: range[0],
              max: range[1],
              type: 'number',
              'aria-labelledby': 'input-slider',
              "position": "left"
            }}
          />
        </div>
        <Slider
            aria-label = {varDisplay}
            size="small"
            min = {range[0]}
            max = {range[1]}
            // defaultValue={range}
            getAriaLabel={() => 'Temperature range'}
            value={value}
            onChange={handleChange}
            onChangeCommitted = {handleCommittedChange}
            // valueLabelDisplay="auto"
        />

        </>
         );
}
