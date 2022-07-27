import React, { useRef, useState, useLayoutEffect, useContext } from "react";
import { Modal, Box } from "@mui/material";

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

const UniversalViewer = ({ manifest }) => {
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

const modalStyle = 
  {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    p: 4,
    overflow: "scroll",
    maxHeight: 500,
  };

export default function UVModal(props) {
    const { 
            manifest, setManifest, 
            uvOpen, setUVOpen, 
            handleUVOpen, handleUVClose
          } = useContext(props.useContext);
    return (
      <Modal
          open={uvOpen}
          onClose={handleUVClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
      >
          <Box sx={modalStyle}>
              <UniversalViewer manifest={manifest}/>
          </Box>
      </Modal>
    )
}