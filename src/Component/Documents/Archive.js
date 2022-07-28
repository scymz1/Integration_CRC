import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button, Modal, Box, Container, Avatar, ListItem,Dialog } from "@mui/material";
import ResponsiveAppBar from "../NavBar";

import "universalviewer/dist/esm/index.css";
import { init } from "universalviewer";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';

import {
    useWindowSize,
  } from '@react-hook/window-size'


function useUniversalViewer(ref, options) {
    const [uv, setUv] = useState();
  
    useLayoutEffect(() => {
      const currentUv = init(ref.current, options);
      setUv(currentUv);
  
      return () => {
        currentUv.dispose();
      };
    }, []);
  
    return uv;
  }

const UV = ({ manifest, parentWidth }) => {
  const el = useRef();
  const viewer = useUniversalViewer(
    el,
    {
      manifest,
    }
  );
  return <div ref={el} 
              className="uv" 
              style={{
                        width: "50vw",
                        height: "50vh"
                    }}/>;
};
export default function Archive() {
    const [width, height] = useWindowSize()
    const DocContext = React.createContext({});
    const [manifest, setManifest]= useState({});
    const [open, setOpen] = useState(false);
    const apiUrl = ["http://150.136.1.167/iiif/3/766",
    "http://150.136.1.167/iiif/3/1353",
    "http://150.136.1.167/iiif/3/1355",
    "http://150.136.1.167/iiif/3/1357",
    "http://150.136.1.167/iiif/3/1359",
    "http://150.136.1.167/iiif/3/1361",
    "http://150.136.1.167/iiif/3/1363",
    "http://150.136.1.167/iiif/3/1365",
    "http://150.136.1.167/iiif/3/1367",
    "http://150.136.1.167/iiif/3/1369",
    "http://150.136.1.167/iiif/3/1371",
    "http://150.136.1.167/iiif/3/1373"]
    const [itemData, setData] = useState([])
    const handleOpen = (manifest) => {
      setOpen(true);
      setManifest(manifest)}
    const handleClose = () => setOpen(false);
    const modalStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        p: 4,
        overflow: "scroll",
        maxHeight: 500,
      };
      
      useEffect(() => {
        const fetchData = async ()=> {
          const promises = apiUrl.map(uri => {
            return fetch(uri, {
              method: "GET",
            }).then(res => res.json()).then(res => {
              var dict = {"title": res.label.none[0], "image": res.thumbnail[0].id,"uri":uri}
              return dict;
            })
          })
          const response = await Promise.all(promises)
          setData(response)
        }
        fetchData().catch(console.error);
      }, [])
    // console.log(itemData)
    return (
        <div>
            <ImageList sx={{ width: width, height: height }} cols={5} gap={30} >
              {itemData.map((item) => (
                <ImageListItem key={item.image}>
                  <img
                    src={`${item.image}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={item.title}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${item.title}`}
                        onClick={() => handleOpen(item.uri)}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <UV manifest={manifest} />
                </Box>
            </Modal>
        </div>
    );
}