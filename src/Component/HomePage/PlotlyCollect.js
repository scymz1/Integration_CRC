import React from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import ImageListItem from '@mui/material/ImageListItem';
import ImageList from '@mui/material/ImageList';
import LazyLoad from 'react-lazyload';

function PlotlyCollect() {
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
        }
      ];

  return(
  <Container maxWidth="xl">
      <ImageList sx={{ width: "100%", height: "100%"}} cols={1} rowHeight={"100%"}>
  {itemData.map((item) => (
    <LazyLoad once={item.once} key={item} height={200} offset={[-100, 0]}>
    <ImageListItem key={item.img}>
      <img
        src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
        srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
        alt={item.title}
        // loading="lazy"
      />

    </ImageListItem>
    </LazyLoad>
  ))}
</ImageList>
  </Container>
  );
}

export default PlotlyCollect;
