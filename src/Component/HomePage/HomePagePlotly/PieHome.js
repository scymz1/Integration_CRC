import React, { Component, PureComponent, useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import { Grid, Paper, Typography, Card, CardContent  } from "@mui/material";
import {
  donut_value_vars,
  donut_name_vars,
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

function PieComponent() {
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: donut_name_vars[0],
    value: donut_value_vars[1],
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
        console.log(plot_value);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  return (
    <div>
      <Grid container spacing={5}>
      <Grid item xs={6}>
          <Card>
            <div>
              <CardContent>
                <Typography component="h2" variant="h5">
                  {featuredPosts.title}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {featuredPosts.date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {featuredPosts.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Continue reading...
                </Typography>
              </CardContent>
            </div>
          </Card>
        </Grid>
        
        <Grid item xs={6}>
          <Plot
            data={[
              {
                labels: plot_field,
                values: plot_value,
                type: "pie",
                mode: "lines+markers",
              },
            ]}
            layout={{ title: "Pie Plot" }}
            config={{ responsive: true }}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default PieComponent;
