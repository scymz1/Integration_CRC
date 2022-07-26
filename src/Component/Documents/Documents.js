import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import { Button, Modal, Box, Container, Avatar } from "@mui/material";
import ResponsiveAppBar from "../NavBar";

import "universalviewer/dist/esm/index.css";
import { init } from "universalviewer";

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

export default function Documents() {
    const DocContext = React.createContext({});
    const [manifest, setManifest]= useState("http://150.136.1.167/iiif/3/766");
    const [title, setTitle] = useState(null);
    const [image, setImage] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
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
        fetch(manifest)
            .then((response) => response.json())
            .then((response) => {
                    setTitle(response.label.none);
                    setImage(response.thumbnail[0].id)
                })
    },[]);
    
    return (
        <div>
            <DocContext.Provider value={{dataSet:"0", pageType:"home"}}>
                <ResponsiveAppBar context={DocContext}/>
            </DocContext.Provider>
            <Button onClick={handleOpen} startIcon={<Avatar src={image}/>} >
                {title}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                {/* <div> */}
                    <UV manifest={manifest} />
                {/* </div> */}
                </Box>
            </Modal>
        </div>
    );
}