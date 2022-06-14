import React, { Component, PureComponent, useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import { Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { bar_x_vars, bar_y_vars } from "../../VoyagePage/Result/vars";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
    title: "Featured post",
    date: "June 14, Tue",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
}

function BarComponent() {
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: bar_x_vars[0],
    value: bar_y_vars[1],
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
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [option.field, option.value, aggregation]);

  return (
    <div>
    <Grid container spacing={5}>
      <Grid item xs={6}>
        <Plot
          data={[
            {
              x: plot_field,
              y: plot_value,
              type: "bar",
              mode: "lines+markers",
            },
            { type: "bar" },
          ]}
          layout={{ title: "bar Plot" }}
          config={{ responsive: true }}
        />
      </Grid>
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
    </Grid>
    </div>
  );
}

export default BarComponent;
