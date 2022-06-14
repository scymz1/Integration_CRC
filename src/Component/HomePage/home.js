import * as React from 'react';
import TrackVisibility from 'react-on-screen';
import {Animated} from "react-animated-css";
import {Card, CardContent, CardHeader, List, ListItem} from "@mui/material";
import ResponsiveAppBar from "../NavBar";
import Container from "@mui/material/Container";
import BarComponent from "./HomePagePlotly/BarHome";
import PieComponent from './HomePagePlotly/PieHome';
import ScatterComponent from './HomePagePlotly/ScatterHome';

export default function Home() {

  const sample = [<BarComponent/>,<PieComponent/>,<ScatterComponent/>]
  return (
    <div>
      <ResponsiveAppBar/>
        <List>
          {
            sample.map((label) =>
              <ListItem key={label}  >
                <TrackVisibility offset={300}>      
                  {({ isVisible }) =>
                    <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
                      {/* <BarComponent/> */}
                      {/* <Card >bo */}
                        {/* <CardHeader title={label}/> */}
                        {/* <CardContent> */}
                          {label}
                        {/* </CardContent>
                      </Card> */}
                    </Animated>
                  }
                </TrackVisibility>
              </ListItem>
            )
          }
        </List>
    </div>
  );
}
