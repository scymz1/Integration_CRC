import * as React from 'react';
import TrackVisibility from 'react-on-screen';
import {Animated} from "react-animated-css";
import {useState} from "react";
import Button from "@mui/material/Button";
import {Card, CardContent, CardHeader, List, ListItem} from "@mui/material";

export default function Home() {
  const [visible, setVisible] = useState(true)
  const sample = ["Bar", "Pie", "Scatter", "Table"]
  return (
    <div>
      <Button onClick={()=>{console.log(visible);setVisible(!visible)}}>
        visible
      </Button>
      <List >
        {
          sample.map((label) =>
            <ListItem key={label}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
                    <Card sx={{height:500, width:1000, background:"blue"}} >
                      <CardHeader title={label}/>
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
    </div>
  );
}
