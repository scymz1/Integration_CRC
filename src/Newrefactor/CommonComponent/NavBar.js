import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Drawer, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import {Link} from "react-router-dom";
import logo from "../../images/sv-logo.png";
import Icon from "@mui/material/Icon";

export default function Navbar(props) {
  const {dataset, setDataset, pageType} = props.state

  return (
    <AppBar position="static">
      <Toolbar>
        <Icon>
          <img src={logo} height={30} width={60} />
        </Icon>
        <Typography variant="h5" sx={{ flexGrow: 1, fontFamily: "monospace",letterSpacing: ".3rem",}}>
          Voyages
        </Typography>

        <ToggleButtonGroup
          value={dataset}
          exclusive
          onChange={(event) => {setDataset(event.target.value)}}
          size={"small"}
        >
          <ToggleButton sx={{background: "#42a5f5"}} value={0} >Trans-Atlantic</ToggleButton>
          <ToggleButton sx={{background: "#ab47bc"}} value={1} >Intra-American</ToggleButton>
        </ToggleButtonGroup>

        <Link to={"/refactor/voyage"} style={{ textDecoration: "none" }}>
          <Button sx={{color: "white"}}>
            Past
          </Button>
        </Link>
        <div>
          <Drawer
            elevation={10}
            anchor={"left"}
            open={true}
            onClose={()=>{}}
          >
            asdsa
          </Drawer>
        </div>
      </Toolbar>
    </AppBar>
  )
}