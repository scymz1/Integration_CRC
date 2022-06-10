import {Button, Container, Grid} from "@mui/material";
import {useContext} from "react";
import {GlobalContext} from "../../App";

export default function Filter(props) {
    const {options_tree, options_flat, search_object, set_search_object} = useContext(GlobalContext);
    
    function handleClick(){
        set_search_object({
            ...search_object,
            years: ["1888", "1999"]
        })
    }
    return (
        <Container sx={{border: 1, height:200}}>
            <h1>Filter</h1>
            <Grid container spacing={2} direction="row" justifyContent="center" sx={{border: '1px dashed grey'}}>
                <Grid item>options_flat test: {(options_flat.id.label === "ID").toString()}</Grid>
                <Grid item>options_tree test: {(options_tree.id.label === "ID").toString()}</Grid>
            </Grid>
            <Button onClick={handleClick}>
                Set New
            </Button>
        </Container>
        
    )
}