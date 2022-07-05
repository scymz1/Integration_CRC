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
import {donut_value_vars, donut_name_vars} from './vars';
import { VoyageContext } from '../VoyageApp';
import { Grid, Paper} from '@mui/material';




//const option_url = '/voyage/' + '?hierarchical=false'

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

console.log(process.env.REACT_APP_BASEURL)


function Pie () {

    const {
        search_object,
    } = React.useContext(VoyageContext)

    const [plot_field, setarrx] = useState([])
    const [plot_value, setarry] = useState([])

    // const [option_field, setField] = React.useState(scatter_plot_x_vars[0]);
    // const [option_value, setValue] = React.useState(scatter_plot_y_vars[1]);

    const [option, setOption] = useState({
        field: donut_name_vars[0],
        value: donut_value_vars[1]
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

        axios.post('/voyage/groupby', data)
            .then(function (response) {

                setarrx(Object.keys(response.data[value]))
                setarry(Object.values(response.data[value]))

                // console.log(plot_value)

            })
            .catch(function (error) {
                console.log(error);
            });

<<<<<<< HEAD
    }, [option.field, option.value, aggregation, search_object]);
=======
    }, [option.field, option.value, aggregation]); // eslint-disable-line react-hooks/exhaustive-deps
>>>>>>> 6e23f1501d9973f13db93df90c3f40d239de4c62


    return (
        <div>
            <div>
                <Box sx={{ minWidth: 120}}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Sectors</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.field}
                            label="Sectors"
                            onChange={(event) => {handleChange(event, "field")}}
                            name="field"
                        >
                            {donut_name_vars.map((option) => (
                                <MenuItem value={option}>
                                    {option}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ minWidth: 120,my:2  }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Values</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={option.value}
                            name="value"
                            label="Values"
                            onChange={(event) => {handleChange(event, "value")}}
                        >
                            {donut_value_vars.map((option) => (
                                <MenuItem value={option}>
                                    {option}
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
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 500,
                        }}
                        >
                        <Plot
                            data={[
                                {
                                    labels: plot_field,
                                    values: plot_value,
                                    type: 'pie',
                                    mode: 'lines+markers',
                                }
                            ]}
                            layout={ {title: 'Pie Plot'} }
                            config={{responsive: true}}
                        />
                    </Paper>
                </Grid>
            </div>
        </div>
    )


}


export default Pie;


