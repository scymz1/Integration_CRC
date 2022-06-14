import * as React from 'react';
import TrackVisibility from 'react-on-screen';
import {Animated} from "react-animated-css";
import {Card, CardContent, CardHeader, List, ListItem} from "@mui/material";
import ResponsiveAppBar from "../NavBar";
import Container from "@mui/material/Container";
import Bar from "../VoyagePage/Result/Bar";
import Pie from "../VoyagePage/Result/Pie";
import Scatter from "../VoyagePage/Result/Scatter";

export default function Home() {

  const sample = [<Bar/>, <Pie/>, <Scatter/>]
  return (
    <div>
      <ResponsiveAppBar/>
      <Container>
        <List >
          {
            sample.map((label) =>
              <ListItem key={label}>
                <TrackVisibility offset={300}>
                  {({ isVisible }) =>
                    <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
                      <Card >
                        {/*<CardHeader title={label}/>*/}
                        <CardContent>
                          {label}
                        </CardContent>
                      </Card>
                    </Animated>
                  }
                </TrackVisibility>
              </ListItem>
            )
          }
        </List>
      </Container>
    </div>
  );
}
