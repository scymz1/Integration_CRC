import * as React from "react";
import TrackVisibility from "react-on-screen";
import { Animated } from "react-animated-css";
import { Box, Card, CardContent, CardHeader, List, ListItem,Divider  } from "@mui/material";
import ResponsiveAppBar from "../NavBar";
import Container from "@mui/material/Container";
import BarComponent from "./HomePagePlotly/BarHome";
import PieComponent from "./HomePagePlotly/PieHome";
import ScatterComponent from "./HomePagePlotly/ScatterHome";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './home.css';

const darkTheme = createTheme({
  
  palette: {
    mode: 'dark',
  },
});

export default function Home() {
  document.body.style = 'background: rgba(17, 7, 12, 0.8);';
  const sample = [<ScatterComponent />,<BarComponent />, <PieComponent />];
  return (
    // <Box sx={{backgroundColor: "black"}}>
    <ThemeProvider theme={darkTheme}>
    <div>
      <ResponsiveAppBar />
    <Container maxWidth={false}>
      <List>
        {sample.map((label) => (
          <ListItem key={label}>
            <TrackVisibility offset={300}>
              {({ isVisible }) => (
                <Animated
                  animationIn="bounceInLeft"
                  animationOut="fadeOut"
                  isVisible={isVisible}
                >
                  {label}
                  <Divider />
                </Animated>
              )}
            </TrackVisibility>
          </ListItem>
        ))}
   
      </List>
      </Container>
    </div>
    </ThemeProvider>
    // </Box>
  );
}
