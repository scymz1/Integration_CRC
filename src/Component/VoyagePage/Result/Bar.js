import React, { useState, useEffect } from 'react'
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from 'axios'
import Plot from 'react-plotly.js';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormControlLabel, RadioGroup } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import {bar_x_vars,bar_y_vars} from './vars';
import { Grid, Paper} from '@mui/material';
import * as options_flat from "../../util/options.json"
import {
    useWindowSize,
  } from '@react-hook/window-size'

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

function Bar (props) {
    const [width, height] = useWindowSize()
    const {
        search_object, endpoint
    } = React.useContext(props.context)

    const [plot_field, setarrx] = useState([])
    const [plot_value, setarry] = useState([])

    // const [option_field, setField] = React.useState(scatter_plot_x_vars[0]);
    // const [option_value, setValue] = React.useState(scatter_plot_y_vars[1]);

    const [option, setOption] = useState({
        field: bar_x_vars[0],
        value: bar_y_vars[1]
    })

    const [aggregation, setAgg] = React.useState('sum');

    //const {sum, average} = aggregation;

    const handleChange_agg = (event) => {
        setAgg(event.target.value);
    };

    const handleChange = (event, name) => {
        setOption({
            ...option,
            [name]: event.target.value,
        })
    }
    useEffect(() => {
        //var group_by = option.field
        var value = option.value
        //var agg = aggregation


        var data = new FormData();
        data.append('hierarchical', 'False');

        for(var property in search_object) {
            //console.log("p",property)
            //console.log('so', search_object[property])
            // eslint-disable-next-line no-loop-func
            search_object[property].forEach((v)=>{
                data.append(property, v)
                //console.log("v", v)
            })
        }

        data.append('groupby_fields', option.field)
        data.append('groupby_fields', option.value)
        data.append('agg_fn', aggregation)
        data.append('cachename','voyage_export')
        axios.post(endpoint + 'groupby', data=data)
            .then(function (response) {

                setarrx(Object.keys(response.data[value]))
                setarry(Object.values(response.data[value]))

                // console.log(plot_value)

            })
            .catch(function (error) {
                console.log(error);
            });

    }, [option.field, option.value, aggregation, search_object]);


    return (
        <div>
            <div>
                <Box sx={{ maxWidth: width>500 ? width*0.9: width * 0.7}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">X Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.field}
                            label="X Field"
                            onChange={(event) => {handleChange(event, "field")}}
                            name="field"
                        >
                            {bar_x_vars.map((option) => (
                                <MenuItem value={option} key={option}>
                                    {options_flat[option].flatlabel}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ maxWidth: width>500 ? width*0.9: width * 0.7,my:2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Y Field</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.value}
                            label="Y Field"
                            name="value"
                            onChange={(event) => {handleChange(event, "value")}}
                        >
                            {bar_y_vars.map((option) => (
                                <MenuItem value={option} key={option}>
                                    {options_flat[option].flatlabel}
                                </MenuItem>
                            ))}
                            {/* <MenuItem value={scatter_plot_x_vars}>{scatter_plot_x_vars}</MenuItem> */}

                        </Select>
                    </FormControl>
                </Box>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Aggregation Function</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={aggregation}
                        onChange={handleChange_agg}
                        row
                    >
                        <FormControlLabel value="sum" control={<Radio />} label="Sum" />
                        <FormControlLabel value="mean" control={<Radio />} label="Average" />
                    </RadioGroup>
                </FormControl>
            </div>

            <div>
                <Grid>
                        <Plot
                            data={[
                                {
                                    x: plot_field,
                                    y: plot_value,
                                    type: 'bar',
                                    mode: 'lines+markers',
                                },
                                {type: 'bar'},
                            ]}
                            layout={{width: width*0.8,title: `The ${aggregation} of ${options_flat[option.field].flatlabel} with ${options_flat[option.value].flatlabel} Bar Graph`,
                            xaxis:{
                                title: 
                                {text:`${options_flat[option.field].flatlabel}`},
                                fixedrange: true
                                },
                            yaxis:{
                            title: 
                            {text:`${options_flat[option.value].flatlabel}`},
                            fixedrange: true
                            }}}
                            config={{responsive: true}}
                        />
                </Grid>
            </div>
        </div>
    )


}


export default Bar;