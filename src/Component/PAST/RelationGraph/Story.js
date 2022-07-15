import {useContext, useState} from "react";
import {PASTContext} from "../PASTApp";
import {useQuery} from "react-query";
import { Card, CardHeader, CardContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from "react";
import _ from 'lodash';
import "./styles.css"

const Div = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

export default function Story (props) {
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //Story做为比Sankey，Network更小一级的component，和Sankey，Network的数据不同步,
  //调用时使用： <Story target={[target_id1, target_id2]} type="your type"/>
  //target: the character of the popover story
  const {target, type} = props;
  const isMale = _.get(target, "gender", "1") != 0;

  return (
    <Card 
    // sx={{ flexGrow: 1,  width: 400}}
    className="story"
    >
      <CardHeader
        title={`Story of ${_.get(target, ["documented_name"], "* name NA *")}`}
      />
      <CardContent>
        <Div>{_.get(target, ["documented_name"], "* name NA *")} was <b>{_.get(target, ["captive_fate", "name"], "* captive fate NA *")}</b> at beginning, transported on voyage <b>{_.get(target, ["voyage", "id"], "* target NA *")}</b></Div>
        <Div>The voyage took {isMale ? "him" : "her"} from <b>{_.get((target, ["voyage", "voyage_itinerary", "imp_port_voyage_begin", "geo_location", "name"], "* start port NA *") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_region_voyage_begin", "geo_location", "name"], "* start region NA *")) + ")"}</b> to <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "* des port NA *") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_principal_region_slave_dis", "geo_location", "name"], "* des region NA *") + ") "}</b> in <b>{_.get(target, ["voyage", "voyage_dates", "date_departed_africa_yyyy"])}</b></Div>
	      <Div>The ship, <b>{_.get(target, ["voyage", "voyage_ship", "ship_name"], "* ship name NA *")}</b>, was owned by <b>{_.get(target, ["voyage", "voyage_captainconnection", 0, "captain", "name"], "* captain name NA *")}</b></Div>
	      <Div>{isMale ? "He" : "She"} was consigned by CONSIGNOR, and sold by SELLER to BUYER in <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "location_type", "name"], "* purchase location type *")}:</b> <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_place_of_slave_purchase", "geo_location", "name"], "* purchase location name NA *")}</b> on TRANSACTION DATE.</Div>
      </CardContent>
    </Card>
  )
}