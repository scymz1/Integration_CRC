// import React, {useContext} from "react";
// import {Container, Grid} from "@mui/material";
// import {VoyageContext} from "../VoyageApp";
//
// export default function Result(props) {
//     const {options_tree, options_flat, search_object, set_search_object} = useContext(VoyageContext);
//
//     return (
//         <Container sx={{border: 1, height:400}}>
//             <h1>Result</h1>
//             <Grid container spacing={2} direction="row" justifyContent="center" sx={{border: '1px dashed grey'}}>
//                 <Grid item>options_flat test: {(options_flat.id.label === "ID").toString()}</Grid>
//                 <Grid item>options_tree test: {(options_tree.id.label === "ID").toString()}</Grid>
//             </Grid>
//             <div>
//                 {Object.keys(search_object).map((key) => {
//                     return (search_object[key].map((value) => {
//                         return (<p>{key}:{value}</p>)
//                     }))
//                 })}</div>
//         </Container>
//     )
// }