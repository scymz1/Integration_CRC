import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import LazyLoad from 'react-lazyload';
import TrackVisibility from "react-on-screen";


import {useState} from "react";
import {Animated} from "react-animated-css";
import Button from "@mui/material/Button";
import {Grid, Card, CardContent, CardHeader, List, ListItem} from "@mui/material";


import Scatter from "./HomePageChart/Scatter";
import Pie from "./HomePageChart/Pie";
import Bar from "./HomePageChart/Bar";


const ComponentToTrack = ({ isVisible }) => {
  const style = {
      background: isVisible ? 'red' : 'blue'
  };
  return <div style={style}>Hello</div>;
} 


function PlotlyCollect() {

  const sample = ["Bar", "Pie", "Scatter", "Table"]

    const itemData = [
        {
          img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
          title: 'Breakfast',
        },
        {
          img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
          title: 'Burger',
        },
        {
          img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
          title: 'Camera',
        },
        {
          img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
          title: 'Coffee',
        },
        {
          img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
          title: 'Hats',
        },
        {
          img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
          title: 'Honey',
        },
        {
          img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
          title: 'Basketball',
        },
        {
          img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
          title: 'Fern',
        },
        {
          img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
          title: 'Mushrooms',
        },
        {
          img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
          title: 'Tomato basil',
        },
        {
          img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
          title: 'Sea star',
        },
        {
          img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
          title: 'Bike',
        },
      ];

  return(
  <Container maxWidth="xl">
        <TrackVisibility>
            <ComponentToTrack />
        </TrackVisibility>

    {/* <div>
      <List >
        {
          sample.map((label) =>
            <ListItem key={label}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
                    <Card sx={{height:250, width:500, background:"blue"}} >
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
    </div> */}

<Grid container spacing={40}>
    <Grid item xs={5}>
      <TrackVisibility>
        {({ isVisible }) =>
          <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
            <Card sx={{height:400, width:500, background:"white"}} >
            <CardHeader title={"Bar"}/>
            <CardContent>
              <Bar/>
            </CardContent>
            </Card>
          </Animated>
        }
      </TrackVisibility>
    </Grid>
    <Grid item xs={6}>
      <TrackVisibility>
        {({ isVisible }) =>
          <Animated animationIn="bounceInRight" animationOut="fadeOut" isVisible={isVisible}>
            <Card sx={{height:400, width:500, background:"white"}} >
            <CardHeader title={"Bar"}/>
            <CardContent>
              <Bar/>
            </CardContent>
            </Card>
          </Animated>
        }
      </TrackVisibility>
    </Grid>
  </Grid>


  <Grid container spacing={40}>
    <Grid item xs={5}>
    <List >
        {
          sample.map((label) =>
            <ListItem key={label}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
                    <Card sx={{height:250, width:500, background:"blue"}} >
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
    </Grid>
    <Grid item xs={6}>
    <List >
        {
          sample.map((label) =>
            <ListItem key={label}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <Animated animationIn="bounceInRight" animationOut="fadeOut" isVisible={isVisible}>
                    <Card sx={{height:250, width:500, background:"blue"}} >
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
    </Grid>
  </Grid>

  <div>
  <ImageList sx={{ width: "100%", height: "100%"}} cols={1} rowHeight={"100%"}>
        {
          itemData.map((item) =>
            <ImageListItem key={item.img}>
              <TrackVisibility>
                {({ isVisible }) =>
                  <Animated animationIn="bounceInLeft" animationOut="fadeOut" isVisible={isVisible}>
                    <img
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.title}
                      loading="lazy"
                    />
                  </Animated>
                }
              </TrackVisibility>
            </ImageListItem>
          )
        }
      </ImageList>
    </div>


      <ImageList sx={{ width: "100%", height: "100%"}} cols={1} rowHeight={"100%"}>
      {itemData.map((item) => (
        
          <ImageListItem key={item.img}>
            <LazyLoad height={200} offset={[-100, -500]} >
            <img
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
            </LazyLoad>
          </ImageListItem>
          
        
      ))}
    </ImageList>


  </Container>
  );
}

export default PlotlyCollect;

