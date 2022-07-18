import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Icon from '@mui/material/Icon';
import logo from "../images/sv-logo.png";
import {Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useContext} from "react";

export default function ResponsiveAppBar(props) {
  const {typeForTable, setTypeForTable, search_object, set_search_object} = props
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Icon>
            <img src={logo} height={30} width={60} />
          </Icon>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Voyages
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Voyages
          </Typography>
          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            <Stack spacing={4} direction={"row"}>
              {search_object?
                <ToggleButtonGroup
                  color="success"
                  value={search_object.dataset[0]}
                  exclusive
                  onChange={(event) =>
                    set_search_object({
                      ...search_object,
                      dataset: [event.target.value, event.target.value]
                    })
                  }
                >
                  <ToggleButton value={"0"}>Trans-Atlantic</ToggleButton>
                  <ToggleButton value={"1"}>Intra-American</ToggleButton>
                </ToggleButtonGroup>:
                null}

              {typeForTable?
                <ToggleButtonGroup
                  color="secondary"
                  value={props.typeForTable}
                  exclusive
                  onChange={(event) => setTypeForTable(event.target.value)}
                >
                  <ToggleButton value="slave">Slaves</ToggleButton>
                  <ToggleButton value="enslaver">Enslavers</ToggleButton>
                </ToggleButtonGroup>:
                null}
            </Stack>
          </Box>

          <Box
            display="flex"
            justifyContent="flex-end"
            alignItems="flex-end"
            sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
          >
            <Link to={"/voyage/Scatter"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Voyages
              </Button>
            </Link>
            <Link to={"/past"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Past
              </Button>
            </Link>
            {/*<Link to={"/Blog"} style={{ textDecoration: "none" }}>*/}
            {/*  <Button*/}
            {/*    sx={{*/}
            {/*      my: 2,*/}
            {/*      color: "white",*/}
            {/*      display: "block",*/}
            {/*      position: "right",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Blog*/}
            {/*  </Button>*/}
            {/*</Link>*/}
            {/*<Link to={"/Documents"} style={{ textDecoration: "none" }}>*/}
            {/*  <Button*/}
            {/*    sx={{*/}
            {/*      my: 2,*/}
            {/*      color: "white",*/}
            {/*      display: "block",*/}
            {/*      position: "right",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    Documents*/}
            {/*  </Button>*/}
            {/*</Link>*/}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
