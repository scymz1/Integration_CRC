import React, { Component, PureComponent, useState, useEffect } from 'react'
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
import { GlobalContext } from '../../App';



const option_url = '/voyage/' + '?hierarchical=false'

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;


function Bar () {

    const {
        search_object,
    } = React.useContext(GlobalContext)

    const [plot_field, setarrx] = useState([])
    const [plot_value, setarry] = useState([])

    // const [option_field, setField] = React.useState(scatter_plot_x_vars[0]);
    // const [option_value, setValue] = React.useState(scatter_plot_y_vars[1]);

    const [option, setOption] = useState({
        field: bar_x_vars[0],
        value: bar_y_vars[1]
    })

    const [aggregation, setAgg] = React.useState('sum');

    const {sum, average} = aggregation;

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


        var data = new FormData();
        data.append('hierarchical', 'False');

        for(var property in search_object) {
            console.log("p",property)
            console.log('so', search_object[property])
            search_object[property].forEach((v)=>{
                data.append(property, v)
                console.log("v", v)
            })
        }

        data.append('groupby_fields', option.field)
        data.append('groupby_fields', option.value)
        data.append('agg_fn', aggregation)
        data.append('cachename','voyage_export')

        axios.post('/voyage/groupby', data=data)
            .then(function (response) {

                setarrx(Object.keys(response.data[value]))
                setarry(Object.values(response.data[value]))

                // console.log(plot_value)

            })
            .catch(function (error) {
                console.log(error);
            });

    }, [option.field, option.value, aggregation]);


    return (
        <div>
           


            <div>
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
                    layout={ {width: 1000, height: 500, title: 'bar Plot'} }
                    config= {{responsive:true}}
                />
            </div>
        </div>
    )


}


export default Bar;