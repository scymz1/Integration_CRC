import {useContext, useState, useEffect} from "react";
import {PASTContext} from "../PASTApp";
import {useQuery} from "react-query";
import { Button, Card, CardHeader, CardContent, Grid } from "@mui/material";
import { styled } from '@mui/material/styles';
import * as React from "react";
import _ from 'lodash';
import "./styles.css"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import CardActions from '@mui/material/CardActions';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { grey } from '@mui/material/colors';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


const Div = styled('div')(({ theme }) => ({
  ...theme.typography.overline,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <ExpandMoreIcon {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));


export default function Story (props) {
  //targets是目标们的id，type是目标的种类，目前有slave， enslaver这两种.
  //Story做为比Sankey，Network更小一级的component，和Sankey，Network的数据不同步,
  //调用时使用： <Story target={[target_id1, target_id2]} type="your type"/>
  //target: the character of the popover story
  const {target, type, dynamic = false , remoteControl, dataChange, setChipData, slavery = "slaves", setData, data} = props;
  const isMale = _.get(target, "gender", "1") != 2;
  const prefix = _.get(target, ["documented_name"], "Unknown Slave") == 'Unknown' ? "This slave" : _.get(target, ["documented_name"], "Unknown Slave")
  const [expand, setExpand] = new React.useState(false);

  const slaverAlias = [];
  _.get(target, "alias", []).forEach(item => {
    if(item["alias"] !== null) slaverAlias.push(item["alias"]);
  })

  const onclick = () => {
    if(slavery == "slaves"){
      dataChange(preData =>({
        enslavers:[...preData.enslavers],
        slaves:[target["id"]],
        type:"slaves"
      }))
    }else{
      dataChange(preData =>({
        enslavers:[target["id"]],
        slaves:[...preData.slaves],
        type:"enslavers"
      }))
    }
    setChipData({
      [_.get(target, "id", "No Record")] : _.get(target, ["documented_name"], "Unknown Enslaved Person")
    })
    remoteControl();
  }

  const handleExpandClick = () => {
    setExpand(!expand);
  };

  const pastStage = [];

  function checkEnslaver(enslaver){
    var esName = _.get(enslaver, ["enslaver_alias", "alias"], "unentified person")
    var esDate = _.get(enslaver, )
    switch(_.get(enslaver, ["role", "role"], "NA")){
      case "captain":
        return `transported by ${esName}(captain) on `;
      case "investor":
        return `invested by ${esName}`;
      case "buyer":
        return `bought by ${esName}`;
      case "seller":
        return `sold by ${esName}`;
      case "owner":
        return `owned by ${esName}`;
      case "shipper":
        return `shipped by ${esName}(shipper)`;
      case "consignor":
        return `consigned by ${esName}`
      default:
        return "";
    }
  }

  function makePastStage(props){
    var index = 1;
    props.transactions.map(ts => {
    pastStage.push(<b>[transaction {index}] </b>)
      var res = "";
      ts.transaction.enslavers.map(enslaver => {
        res += checkEnslaver(enslaver) + "; ";
      })
      res = res.slice(0, -2);
      pastStage.push(res);
      pastStage.push(_.get(ts, ["transaction", "date"], "NA") == "NA" ? ". " :  " on " + _.get(ts, ["transaction", "date"], "NA") + ". ");
      pastStage.push(" And ")
      index++;
    })
    
    if(pastStage.length == 0) return;
    pastStage.pop();
    pastStage.unshift(isMale ? "He was then: " : "She was then: ");
  }

  return (
    <>
    {/*slaved people*/}
    {!dynamic && slavery == "slaves" && 
    <Card 
    // sx={{ flexGrow: 1,  width: 400}}
    className="enslaved_story"
    >
      <CardHeader
        title={`Story of ${_.get(target, ["documented_name"], "Unknown Enslaved Person")}`}
      />
      <CardContent>
        <Div>{prefix} was <b>{_.get(target, ["captive_fate", "name"], "not recorded with date")}</b>, transported on voyage <b>{_.get(target, ["voyage", "id"], "* target NA *")}</b></Div>
        <Div>The voyage took {isMale ? "him" : "her"} from <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_port_voyage_begin", "geo_location", "name"], "unknown embarking place") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_region_voyage_begin", "geo_location", "name"], "unknown embarking region") + ")"}</b> to <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "unknown destination") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_principal_region_slave_dis", "geo_location", "name"], "unknown parent regoin") + ") "}</b> in <b>{_.get(target, ["voyage", "voyage_dates", "date_departed_africa_yyyy"], "unkown year")}</b></Div>
	      <Div>The ship, <b>{_.get(target, ["voyage", "voyage_ship", "ship_name"], "which has not verified")}</b>, was owned by <b>{_.get(target, ["voyage", "voyage_captainconnection", 0, "captain", "name"], "unknown captain")}</b></Div>
        <Div>{pastStage}</Div>
        {makePastStage(target)}
      </CardContent>

    </Card>}

    {dynamic && slavery == "slaves" && <Card className="enslaved_story_func">
      <CardHeader
      // textTransform: 'capitalize'
        titleTypographyProps = {{ pb:0, typography: 'h3.Heading', variant:"", fontStyle: 'italic', fontSize:35, textAlign: 'right'}}
        title = {_.get(target, ["documented_name"], "Unknown Enslaved Person")}
        sx={{pr: 3, pt:3}}
      />
      {/* <hr/> */}
      <CardContent>
        <List dense = {true} disablePadding={true}>
          <ListItem  disablePadding={true}><ListItemText primary="Enslaved ID" secondary={_.get(target, "id", "No Record")}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Mordern Name" secondary={(_.get(target, ["modern_name"], "No Record") == null) || (_.get(target, ["modern_name"], "No Record") == "") ? "No Record" : _.get(target, ["modern_name"], "No Record") }/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Gender" secondary={_.get(target, "gender") == 1 ? "Male" : _.get(target, "gender") == 2 ? "Female" : "No Record"}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Age" secondary={_.get(target, ["age"], "No Record")}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Fate" secondary={_.get(target, ["captive_fate", "name"], "No Record")}/></ListItem>
        </List>
        {/* <Grid>Mordern Name: {_.get(target, ["modern_name"], "No Record")}</Grid>
        <Grid>Sex: {_.get(target, "gender") == 1 ? "Male" : _.get(target, "gender") == 0 ? "Female" : "No Record"}</Grid>
        <Grid>Age: {_.get(target, "age", "No Record")}</Grid>
        <Grid>Fate: {_.get(target, ["captive_fate", "name"], "No Record")}</Grid>
        <Grid>Traded Year: NA</Grid> */}
      </CardContent>

      <CardActions disableSpacing>
        <Button aria-label="see personal network" size="large" startIcon={<ManageSearchIcon color="disabled" sx={{ color: grey[800]}} onClick={onclick} />}>
        </Button>
        <ExpandMore
          expand={expand}
          onClick={handleExpandClick}
          aria-expanded={expand}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <CardContent>
          <Div>{prefix} was <b>{_.get(target, ["captive_fate", "name"], "not recorded with date")}</b>, transported on voyage <b>{_.get(target, ["voyage", "id"], "* target NA *")}</b></Div>
          <Div>The voyage took {isMale ? "him" : "her"} from <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_port_voyage_begin", "geo_location", "name"], "unknown embarking place") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_region_voyage_begin", "geo_location", "name"], "unknown embarking region") + ")"}</b> to <b>{_.get(target, ["voyage", "voyage_itinerary", "imp_principal_port_slave_dis", "geo_location", "name"], "unknown destination") + " (" + _.get(target, ["voyage", "voyage_itinerary", "imp_principal_region_slave_dis", "geo_location", "name"], "unknown parent regoin") + ") "}</b> in <b>{_.get(target, ["voyage", "voyage_dates", "date_departed_africa_yyyy"], "unkown year")}</b></Div>
          <Div>The ship, <b>{_.get(target, ["voyage", "voyage_ship", "ship_name"], "which has not verified")}</b>, was owned by <b>{_.get(target, ["voyage", "voyage_captainconnection", 0, "captain", "name"], "unknown captain")}</b></Div>
          {makePastStage(target)}
          <Div>{pastStage}</Div>
        </CardContent>
      </Collapse>
        
        {/* <Button variant="contained" startIcon={<VisibilityIcon />} size="large" color="grey" onClick={() => window.alert("hi")} sx={{ ml: 3, mt:3, mb:5, mr: 1 }} /> */}
    </Card>}

    {/*slaver*/}
    {!dynamic && slavery != "slaves" && <Card 
    className="enslaver_story"
    >
      <CardHeader
        title={`Story of ${_.get(target, ["principal_alias"], "Unknown Slaver")}`}
      />
      <CardContent>
        <Div>{_.get(target, ["principal_alias"], "Unknown Slaver")}, {slaverAlias.length > 1 && "also name as kk"} was first recorded at year <b>{_.get(target, "first_active_year", "NA")}</b>, and out of record at <b>{_.get(target, "last_active_year", "NA")}</b></Div>
        <Div>He has enslaved <b>{_.get(target, "number_enslaved", "NA")}</b> people  doing trading business most in <b>{_.get(target, ["principal_location", "geo_location", "name"], "NA")}</b> area</Div>
      </CardContent>

    </Card>}

    {dynamic && slavery != "slaves" && <Card className="enslaver_story_func">
      <CardHeader
        titleTypographyProps = {{ pb:0, typography: 'h3.Heading', variant:"", fontStyle: 'italic', fontSize:35, textAlign: 'right'}}
        title = {_.get(target, ["principal_alias"], "Unknown Slaver")}
        className = "enslaver_story_func_head"
        sx={{pr: 3, pt:3}}
      />
      <CardContent>
        <List dense = {true} disablePadding={true}>
          <ListItem  disablePadding={true}><ListItemText primary="Enslaver ID" secondary={_.get(target, "id", "No Record")}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Principal Alia" secondary={_.get(target, "principal_alias", "No Record")}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="Other Alias" secondary={slaverAlias.length === 1 ? "NA" : slaverAlias}/></ListItem>
          <ListItem  disablePadding={true}><ListItemText primary="People Slaved" secondary={_.get(target, "number_enslaved", "NA")}/></ListItem>
        </List>
      </CardContent>

      <CardActions disableSpacing>
        <Button aria-label="see personal network" size="large" startIcon={<ManageSearchIcon color="disabled" sx={{ color: grey[800]}} onClick={onclick} />}>
        </Button>
        <ExpandMore
          expand={expand}
          onClick={handleExpandClick}
          aria-expanded={expand}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <CardContent>
          <Div>{_.get(target, ["principal_alias"], "Unknown Slaver")}, {slaverAlias.length > 1 && "also name as kk"} was first recorded at year <b>{_.get(target, "first_active_year", "NA")}</b>, and out of record at <b>{_.get(target, "last_active_year", "NA")}</b></Div>
          <Div>He has enslaved <b>{_.get(target, "number_enslaved", "NA")}</b> people,  doing trading business often in <b>{_.get(target, ["principal_location", "geo_location", "name"], "NA")}</b> area</Div>
        </CardContent>
      </Collapse>
      
    </Card>}
    </>
  )
}