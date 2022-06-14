import * as React from "react";
import TrackVisibility from "react-on-screen";
import { Animated } from "react-animated-css";
import { Card, CardContent, CardHeader, List, ListItem,Divider  } from "@mui/material";
import ResponsiveAppBar from "../NavBar";
import Container from "@mui/material/Container";
import BarComponent from "./HomePagePlotly/BarHome";
import PieComponent from "./HomePagePlotly/PieHome";
import ScatterComponent from "./HomePagePlotly/ScatterHome";

export default function Home() {
  const sample = [<BarComponent />, <PieComponent />, <ScatterComponent />];
  return (
    <div>
      <ResponsiveAppBar />
    <Container>
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
  );
}
