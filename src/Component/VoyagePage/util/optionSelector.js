import {useContext, useState} from "react";
import {
    Container,
    ListItem,
    Grid,
    ListItemText,
    Card, CardContent, CardHeader, Box, Chip, Button
} from '@mui/material';
import {TreeView, TreeItem} from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as React from 'react';
import {GlobalContext} from "../../App";

function OptionSelector(props) {
    const [resultObject, setResultObject] = useState([]);
    const {options_tree: options} = useContext(GlobalContext)

    function isChildren(key) {
        return key !== "type" && key !== "label" && key !== "flatlabel"
    }

    function isLast(node) {
        return Object.keys(node).length <= 3
    }

    var count = 0;
    const renderTree = (nodes, name) => (
        <TreeItem key={nodes.label} nodeId={""+count++} label={nodes.label? nodes.label:"Menu"}>
            { Object.keys(nodes).map((key) =>
                isChildren(key)
                    ? isLast(nodes[key])
                        ? <ListItem key={key} disablePadding>
                            <Button  onClick={(event) => handleClick(name ? (name.slice(2)+"__"+key) : key, nodes[key])}>
                                Add
                            </Button>
                            <ListItemText primary={key+" ("+nodes[key].flatlabel+")"} secondary={nodes[key].type}/>
                        </ListItem>
                        : renderTree(nodes[key], name+"__"+key)
                    : null
                )
            }
        </TreeItem>
    );

    function handleClick(name, object){
        setResultObject({
            ...resultObject,
            [name]: object
        })
        console.log(resultObject)
    }

    function handleDelete(key){
        let newObject = {...resultObject};
        delete newObject[key];
        setResultObject(newObject)
    }

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Card sx={{height: 800, flexGrow: 1, maxWidth: 800, overflowY: 'auto'}}>
                        <CardContent>
                            <TreeView
                                aria-label="option menu"
                                defaultCollapseIcon={<ExpandMoreIcon/>}
                                defaultExpandIcon={<ChevronRightIcon/>}
                            >
                                {renderTree(options, "")}
                            </TreeView>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={4}>
                    <Card  sx={{ flexGrow: 1, height: 800, overflowY: 'auto'}}>
                        <CardHeader
                            title="Selected Options"
                        />
                        <CardContent>
                            <Box>
                                <Grid container spacing={2}>
                                    {Object.keys(resultObject).map((key) =>
                                        <Grid item key={key}>
                                            <Chip label={key} color="primary" onDelete={(e) => handleDelete(key)}/>
                                        </Grid>)}
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <p>{JSON.stringify(resultObject)}</p>
        </Container>
    );
}

export default OptionSelector;