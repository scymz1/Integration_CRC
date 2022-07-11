import React, {useEffect, useState} from "react";
// import { Form, Input, InputNumber, Radio, Modal, Cascader ,Tree} from 'antd'
import axios from "axios";
import Plot from "react-plotly.js";
import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import {scatter_plot_x_vars, scatter_plot_y_vars,} from "../../VoyagePage/Result/vars";
import {Link, useNavigate} from 'react-router-dom';

const AUTH_TOKEN = process.env.REACT_APP_AUTHTOKEN;
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;
axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;

const featuredPosts = {
  title: "Data Visualization - Scatter",
  date: "July 8, 2022",
  description:
    "This scatter/line chart shows the number of enslaved people who we estimate died during transportation each year during the slave trade. Click through to view more scatter/line charts, which compare 2 quantitative variables, such as mortality on the Y/vertical axis, and year on the X/horizontal axis",
};

function ScatterComponent() {
  const [plot_field, setarrx] = useState([]);
  const [plot_value, setarry] = useState([]);
  const [option, setOption] = useState({
    field: "voyage_dates__imp_arrival_at_port_of_dis_yyyy",
    value: "voyage_slaves_numbers__imp_adult_death_middle_passage",
  });
  const [aggregation, setAgg] = React.useState("sum");
  useEffect(() => {
    var value = option.value;
    var data = new FormData();
    data.append("hierarchical", "False");
    data.append("groupby_fields", option.field);
    data.append("groupby_fields", option.value);
    data.append("agg_fn", "sum");
    data.append("cachename", "voyage_xyscatter");

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

  const navigate = useNavigate();
  const GotoVoyagePage = () => {
    navigate('/voyage/Scatter');
  }

  return (
    <div>
      <Card sx={{ display: "flex" }} style={{background: 'transparent', boxShadow: 'none'}}>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Plot
              data={[
                {
                  x: plot_field,
                  y: plot_value,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: {color: "red"},
                },
              ]}
              layout={{width: 800, height: 600, title: "Scatter Plot"}}
              config={{responsive: true}}
            />
          </CardContent>
        </Box>

        <Box sx={{boxShadow: 4, margin: 2, padding:2, borderRadius: '10px'}} style={{backgroundColor: "#f1f1f1"}}>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Button variant="text" style={{ fontSize: '24px' }} component={Link} to="/voyage/Scatter">Data Visualization - Scatter Charts</Button>
              <CardContent>
                <Typography variant="subtitle1" color="textSecondary">
                  {featuredPosts.date}
                </Typography>
                <Typography variant="subtitle1" paragraph>
                  {featuredPosts.description}
                </Typography>
                <Button variant="text" type="button" onClick={GotoVoyagePage}>
                  Continue reading...
                </Button>
              </CardContent>
          </CardContent>
        </Box>
      </Card>
    </div>
  );
}

export default ScatterComponent;