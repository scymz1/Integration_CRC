import React, { Component, PureComponent, useState, useEffect } from 'react'
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from 'axios'
import Plot from 'react-plotly.js';
import { Grid, Paper} from '@mui/material';
import {donut_value_vars,donut_name_vars} from'../../VoyagePage/Result/vars'
const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

function PieComponent () {
    const [plot_field, setarrx] = useState([])
    const [plot_value, setarry] = useState([])
    const [option, setOption] = useState({
        field: donut_name_vars[0],
        value: donut_value_vars[1]
    })
    const [aggregation, setAgg] = React.useState('sum');
    useEffect(() => {
        var value = option.value
        var data = new FormData();
        data.append('hierarchical', 'False');
        data.append('groupby_fields', option.field)
        data.append('groupby_fields', option.value)
        data.append('agg_fn', 'sum')
        data.append('cachename','voyage_export')

        axios.post('/voyage/groupby', data=data)
            .then(function (response) {
                setarrx(Object.keys(response.data[value]))
                setarry(Object.values(response.data[value]))
                console.log(plot_value);
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [option.field, option.value, aggregation]);


    return (
        <div>
            <div>
                <Grid item xs={12} md={4} lg={3}>
                    <Plot
                        data={[
                            {
                                labels: plot_field,
                                values: plot_value,
                                type: 'pie',
                                mode: 'lines+markers',
                            },
                        ]}
                        layout={ {title: 'Pie Plot'} }
                        config={{responsive: true}}
                    />
                </Grid>
            </div>
        </div>
    )
}

export default PieComponent;