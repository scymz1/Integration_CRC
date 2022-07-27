import React, { useEffect, useState, useContext } from "react";
import { Button, Modal, Box, Card, CardContent, Typography, Container, Avatar } from "@mui/material";

import ResponsiveAppBar from "../NavBar";
import { DocContext } from "./DocumentsApp";
import UVModal from "./UVModal"

export default function Documents(props) {
    const { dataSet, pageType } = useContext(DocContext);
    const UVContext = React.createContext({});
    const [manifest, setManifest]= useState("http://150.136.1.167/iiif/3/766");
    const [title, setTitle] = useState(null);
    const [image, setImage] = useState(null);
    const [uvOpen, setUVOpen] = useState(false);
        const handleUVOpen = () => setUVOpen(true);
        const handleUVClose = () => setUVOpen(false);

    useEffect(() => {
        fetch(manifest)
            .then((response) => response.json())
            .then((response) => {
                    setTitle(response.label.none);
                    setImage(response.thumbnail[0].id)
                })
    },[manifest]);
    
    return (
        <div>
            <ResponsiveAppBar context={DocContext}/>
            <Button onClick={handleUVOpen} startIcon={<Avatar src={image}/>} >
                {title}
            </Button>
            <UVContext.Provider
                value={{
                  manifest, setManifest, 
                  uvOpen, setUVOpen, 
                  handleUVOpen, handleUVClose
                }}>
                <UVModal useContext={ UVContext }/>
            </UVContext.Provider>
        </div>
    );
}
