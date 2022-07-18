import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from '@mui/material/Menu';
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from '@mui/material/MenuItem';
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Icon from '@mui/material/Icon';
import logo from "../images/sv-logo.png";

const pages = ['Voyages', 'Past'];
const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
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
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
                <MenuItem onClick={handleCloseNavMenu}>
                   <Link to={"/voyage/Scatter"} style={{ textDecoration: "none" }}>
                    Voyages
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                <Link to={"/past"} style={{ textDecoration: "none" }}>
                    Past
                </Link>
                </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
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
            <Link to={"/Blog"} style={{ textDecoration: "none" }}>
              <Button
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  position: "right",
                }}
              >
                Blog
              </Button>
            </Link>
            <Link to={"/Documents"} style={{ textDecoration: "none" }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
