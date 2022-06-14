import React, { Component, PureComponent, useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import {Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import {
  scatter_plot_x_vars,
  scatter_plot_y_vars,
} from "../../VoyagePage/Result/vars";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Featured post",
  date: "June 14, Tue",
  description:
    "This is a wider card with supporting text below as a natural lead-in to additional content.",
};

function ScatterComponent() {
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: scatter_plot_x_vars[0],
    value: scatter_plot_y_vars[1],
  });
  const [aggregation, setAgg] = React.useState("sum");
  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("agg_fn", "sum");
    data.append("cachename", "voyage_export");

    axios
      .post("/voyage/groupby", (data = data))
      .then(function (response) {
        setarrx(Object.keys(response.data[value]));
        setarry(Object.values(response.data[value]));

        // console.log(plot_value)
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  return (
    <Card sx={{display: 'flex'}}>
        <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
                <Plot
                data={[
                    {
                    x: plot_field,
                    y: plot_value,
                    type: "scatter",
                    mode: "lines+markers",
                    },
                    { type: "bar" },
                ]}
                layout={{width:800,height:700,title: "Scatter Plot" }}
                config={{ responsive: true }}
                />
            </CardContent>
        </Box>
        <Box>
        <CardContent>
            <Typography component="div" variant="h5">
            Newspapers are printed in several languages.Newspapers are printed in several languages. They are delivered to the doorstep of individuals early in the morning. Newspapers are printed in local languages. They are also printed in several languages that are widely accepted. They newspapers may be dailies.

A weekly subscription will mean that the newspaper or the digest is delivered to your family once a week. Similarly, monthly and yearly subscriptions are also present. Yearly subscriptions can be for magazines that deliver not only the news but also other entertaining stories, pictures, and poems.

On several occasions, you may find a newspaper strip that comes attached with dailies once a week or month.
            </Typography>
        </CardContent>
        </Box>
    </Card>
  );
}

export default ScatterComponent;
