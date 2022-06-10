import Filter from "./Filter/Filter";
import Result from "./Result/Result";
import {useState} from "react";
import React from "react";
import {Container} from "@mui/material";

export default function Voyage() {
    return (
        <Container sx={{border: 1}}>
            <h1>Voyage</h1>
            {/*<SideBar/>*/}
            <Filter />
            <Result />
        </Container>
    )
}