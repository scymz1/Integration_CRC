import {useContext, useState} from "react";
import {PASTContext} from "../PASTApp";
import {useQuery} from "react-query";
import { Card, CardHeader, CardContent } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from "react";
import _ from 'lodash';


const Div = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

export default function Transaction (props) {
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //Story做为比Sankey，Network更小一级的component，和Sankey，Network的数据不同步,
  //调用时使用： <Story target={[target_id1, target_id2]} type="your type"/>
  //target: the character of the popover ßstory
  const {target, type} = props;
  const isMale = _.get(target, "gender", "1") != 0;

  return (
    <Card 
      sx={{ flexGrow: 1,  width: 400}}>
        {/* <CardHeader
        title={`${_.get(target, ["documented_name"], "* name NA *")}`}
      /> */}
       <CardContent>
        <Div><b>Source: </b>{_.get(target, ["transactions","transaction","source","full_ref"], "* target NA *")}</Div>
        <Div><b>Place: </b>{_.get(target, ["transactions__transaction__place__geo_location__name"], "* target NA *")}</Div>
        <Div><b>Date: </b>{_.get(target, ["transactions__transaction__date"], "* target NA *")}</Div>
        <Div><b>Amout: </b>{_.get(target, ["transactions__transaction__amount"], "* target NA *")}</Div>
      </CardContent>
    </Card>
  )
}