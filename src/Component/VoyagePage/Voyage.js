import Filter from "./Filter/Filter";
import Result from "./Result/Result";
import {useState} from "react";
import React from "react";
import {Container} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Voyage() {
    return (
        // hard code side bar here?
        <Container sx={{border: 1}}>
            <h1>Voyage</h1>
            {/*<SideBar/>*/}
            
            <Filter />
            <Result />
        </Container>
    )
}