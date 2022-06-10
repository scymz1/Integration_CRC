import React, { Component, PureComponent, useState, useEffect } from 'react'
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from 'axios'
import Plot from '../../node_modules/react-plotly.js/react-plotly';

//import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormControlLabel, RadioGroup } from '@mui/material';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import { Box, ThemeProvider, createTheme } from '@mui/system';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

const mdTheme = createTheme();
const option_url = '/voyage/' + '?hierarchical=false' // labels in dropdowns

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

var scatter_plot_x_vars=[
    'voyage_dates__imp_arrival_at_port_of_dis_yyyy',
    'voyage_dates__imp_length_home_to_disembark',
    'voyage_dates__length_middle_passage_days',
    'voyage_crew__crew_voyage_outset',
    'voyage_crew__crew_first_landing',
    'voyage_slaves_numbers__imp_total_num_slaves_embarked',
    'voyage_slaves_numbers__imp_total_num_slaves_disembarked'
]

var scatter_plot_y_vars=[
    'voyage_slaves_numbers__imp_total_num_slaves_embarked',
    'voyage_slaves_numbers__imp_total_num_slaves_disembarked',
    'voyage_slaves_numbers__percentage_female',
    'voyage_slaves_numbers__percentage_male',
    'voyage_slaves_numbers__percentage_child',
    'voyage_slaves_numbers__percentage_men_among_embarked_slaves',
    'voyage_slaves_numbers__percentage_women_among_embarked_slaves',
    'voyage_slaves_numbers__imp_mortality_ratio',
    'voyage_slaves_numbers__imp_jamaican_cash_price',
    'voyage_slaves_numbers__percentage_boys_among_embarked_slaves',
    'voyage_slaves_numbers__percentage_girls_among_embarked_slaves',
    'voyage_ship__tonnage_mod',
    'voyage_crew__crew_voyage_outset',
    'voyage_crew__crew_first_landing'
]

function Scatter (props) {

    const [plot_field, setarrx] = useState([])
    const [plot_value, setarry] = useState([])

    const [option, setOption] = useState({
        field: scatter_plot_x_vars[0],
        value: scatter_plot_y_vars[1]
    })

    const [aggregation, setAgg] = React.useState('sum');
    const {sum, average} = aggregation;
    const [label, setLabel] = useState()

    const [isLoading, setLoading] = useState(true);


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
        var group_by = option.field
        var value = option.value
        var agg = aggregation

        var search_object = {
            "voyage_itinerary__imp_principal_region_slave_dis__geo_location__name":[
                "Barbados",
                "Jamaica"
            ],

            'voyage_dates__imp_arrival_at_port_of_dis_yyyy':[1800,1810]
        }

        var data = new FormData();
        data.append('hierarchical', 'False');

        // console.log("sb",props.data)
        for(var property in props.data) {
            // console.log("p",property)
            // console.log('so', props.data[property])
            props.data[property].forEach((v)=>{
                data.append(property, v)
                // console.log("v", v)
            })
        }

        // var data = new FormData();
        data.append('hierarchical', 'False');

        data.append('groupby_fields', option.field)
        data.append('groupby_fields', option.value)
        data.append('agg_fn', aggregation)
        data.append('cachename','voyage_export')

        axios.post('/voyage/groupby', data=data)
            .then(function (response) {

                setarrx(Object.keys(response.data[value]))
                setarry(Object.values(response.data[value]))

            })
            .catch(function (error) {
                console.log(error);
            });

    }, [option.field, option.value, aggregation, props.data]);

    useEffect(() => {
            axios.options(option_url)
                .then(function (response) {

                    setLabel(response.data)
                    setLoading(false)
                })
                .catch(function (error) {
                    console.log(error);
                })
        }, []
    );

    if (isLoading) {
        return <div className="spinner"></div>;
    }

    return (
        <div>
            <div>
            <Grid item xs={2} my={2}> 
                <Divider/>
                <Box sx={{
                    minWidth: 120,
                    my: 2,
                    }}>
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
                            {scatter_plot_x_vars.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {label[option]['flatlabel']}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>  
                </Box>
                <Box sx={{ 
                    minWidth: 120,
                    my: 2,
                     }}>
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
                            {scatter_plot_y_vars.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {label[option]['flatlabel']}
                                </MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                </Box>
                </Grid>
            </div>
            <div>
                <FormControl>
                    <FormLabel id="demo-controlled-radio-buttons-group">Aggregation Function</FormLabel>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={aggregation}
                        onChange={handleChange_agg}
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
                        x: plot_field,
                        y: plot_value,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'red'},
                    },
                    {type: 'bar'},
                ]}
                layout={{title: 'Scatter Plot'}}
                config={{responsive: true}}
                />
                </Paper>
              </Grid>

            </div>
        </div>
    )


}


export default Scatter;