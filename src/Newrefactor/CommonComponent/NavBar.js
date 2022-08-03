import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Drawer, ToggleButton, ToggleButtonGroup, IconButton, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {Link} from "react-router-dom";
import logo from "../../images/sv-logo.png";
import Icon from "@mui/material/Icon";
import FilterAlt from '@mui/icons-material/FilterAlt';

export default function Navbar(props) {
  const {dataset, setDataset, pageType, drawerOpen, setDrawerOpen} = props.state

  return (
    <AppBar position="sticky" elevation={0} style={{ zIndex:3 }}>
      <Toolbar>
        <Icon>
          <img src={logo} height={30} width={60} />
        </Icon>
        <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "monospace",letterSpacing: ".3rem",}}>
          Voyages
        </Typography>
        
        <IconButton aria-label="open drawer" onClick={()=>setDrawerOpen(!drawerOpen)}>
          <FilterAlt sx={{ color: "white" }} />
          <Typography sx={{ color: "white" }}>Filter</Typography>
        </IconButton>

        <ToggleButtonGroup
          value={dataset}
          exclusive
          onChange={(event) => {console.log(event.target.value); setDataset(event.target.value)}}
          size={"small"}
        >
          <ToggleButton sx={{background: "#42a5f5"}} value={"0"} >Trans-Atlantic</ToggleButton>
          <ToggleButton sx={{background: "#ab47bc"}} value={"1"} >Intra-American</ToggleButton>
        </ToggleButtonGroup>
        <Link to={"/voyage"} style={{ textDecoration: "none" }}>
          <Button sx={{color: "white"}}>
            Voyages
          </Button>
        </Link>
        <Link to={"/past/enslaved"} style={{ textDecoration: "none" }}>
          <Button
            sx={{
              my: 2,
              color: "white",
              display: "block",
              position: "right",
            }}
          >
            PAST
          </Button>
        </Link>
        <Link to={"/documents"} style={{ textDecoration: "none" }}>
          <Button
            sx={{
              my: 2,
              color: "white",
              display: "block",
              position: "right",
            }}
          >
            Documents
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  )
}