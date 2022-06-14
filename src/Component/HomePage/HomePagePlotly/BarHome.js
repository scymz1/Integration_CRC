import React, { Component, PureComponent, useState, useEffect } from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import { Button,CardMedia,Box,Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { bar_x_vars, bar_y_vars } from "../../VoyagePage/Result/vars";

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
<<<<<<< HEAD
    title: "Data Visualization - Scatter",
    date: "June 14, Tue",
    description:
    "The sobriquet was first applied around 1879. While it was not intended as flattering, it washardly inappropriate. The Academicians at whom it was aimed had worked and socialized in NewYork, the Hudson's port city, and had painted the river and its shores with varying frequency.Most important, perhaps, was that they had all maintained with a certain fidelity a manner oftechnique and composition consistent with those of America's first popular landscape artist,Thomas Cole, who built a career painting the Catskill Mountain scenery bordering the HudsonRiver. A possible implication in the term applied to the group of landscapists was that many ofthem had, like Cole, lived on or near the banks of the Hudson. Further, the river had long servedas the principal route to other sketching grounds favored by the Academicians, particularly theAdirondacks and the mountains of Vermont and New Hampshire.different ways."
  };
=======
  title: "Featured post",
  date: "June 14, Tue",
  description:
    "This is a wider card with supporting text below as a natural lead-in to additional content.",
};
>>>>>>> 608db01ca731e80a8b721640167a0cc1e9f7fe2d

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
<<<<<<< HEAD
    <Card sx={{display: 'flex'}}>
        <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: '1 0 auto' }}>
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
                layout={{width:800,height:700,title: "bar Plot" }}
                config={{ responsive: true }}
                />
            </CardContent>
        </Box>
        <Box>
        <CardContent>
            <Button variant="text" style={{ fontSize: '25px' }}>Data Visualization: Bar Charts </Button>
        <div>
              <CardContent>
                {/* <Typography component="h2" variant="h5">
                  {featuredPosts.title}
                </Typography> */}
=======
    <div>
      <Grid container spacing={2}>
        <Grid item>
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
        <Grid item xs={4}>
          <Card>
            <div>
              <CardContent>
                <Typography component="h2" variant="h5">
                  {featuredPosts.title}
                </Typography>
>>>>>>> 608db01ca731e80a8b721640167a0cc1e9f7fe2d
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
<<<<<<< HEAD
        </CardContent>
        </Box>
    </Card>
=======
          </Card>
        </Grid>
      </Grid>
    </div>
>>>>>>> 608db01ca731e80a8b721640167a0cc1e9f7fe2d
  );
}

export default BarComponent;
