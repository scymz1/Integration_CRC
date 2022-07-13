import {useContext, useState} from "react";
import {PASTContext} from "../PASTApp";
import {useQuery} from "react-query";
import {Button, CircularProgress, Box, Grid} from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from "react";


const Div = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

export default function Story (props) {
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //Story做为比Sankey，Network更小一级的component，和Sankey，Network的数据不同步,
  //调用时使用： <Story target={[target_id1, target_id2]} type="your type"/>
  //target: the character of the popover ßstory
  const {target, type} = props;
  const isMale = target["gender"] == 1;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h1>Story of {target["documented_name"]}</h1>
      <Grid container spacing={2}>
        <Grid item xs={8}>
        <img src="https://media.gettyimages.com/illustrations/black-slaves-loaded-on-ship-1881-illustration-id157479463?s=612x612"></img>
        </Grid>
        <Grid item xs={4}>
        <Div>{target["documented_name"]} was <b>{target["captive_fate"]["name"]}</b> at beginning, transported on voyage <b>{target["voyage"]["id"]}</b></Div>
        <Div>The voyage took {isMale ? "him" : "her"} from <b>{target["voyage"]["voyage_itinerary"]["imp_port_voyage_begin"]["geo_location"]["name"] + " (" + target["voyage"]["voyage_itinerary"]["imp_region_voyage_begin"]["geo_location"]["name"] + ")"}</b> to <b>{target["voyage"]["voyage_itinerary"]["imp_principal_port_slave_dis"]["geo_location"]["name"] + " (" + target["voyage"]["voyage_itinerary"]["imp_principal_region_slave_dis"]["geo_location"]["name"] + ") "}</b> in <b>{target["voyage"]["voyage_dates"]["date_departed_africa_yyyy"]}</b></Div>
	      <Div>The ship, <b>{target["voyage"]["voyage_ship"]["ship_name"]}</b>, was owned by <b>{target["voyage"]["voyage_captainconnection"][0]["captain"]["name"]}</b></Div>
	      <Div>{isMale ? "He" : "She"} was consigned by CONSIGNOR, and sold by SELLER to BUYER in <b>{target["voyage"]["voyage_itinerary"]["imp_principal_place_of_slave_purchase"]["geo_location"]["location_type"]["name"]}:</b> <b>{target["voyage"]["voyage_itinerary"]["imp_principal_place_of_slave_purchase"]["geo_location"]["name"]}</b> on TRANSACTION DATE.</Div>
        <br/>
        <br/>
        <Button onClick={()=>{
        console.log("props/target:", target);
      }}>print data</Button>
        </Grid>

      </Grid>
    </Box>
  )
}