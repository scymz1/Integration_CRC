import {
    Container,
    Slider,
    Button,
    Checkbox,
    FormControlLabel,
    ListItem,
    Grid,
    List,
    ListItemText,
    Card, CardContent, CardHeader, Box, Paper, Chip, TextField, Menu//, MenuItem
} from '@mui/material';
import {TreeView, TreeItem} from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ArrowRightAlt';
import ChevronRightIcon from '@mui/icons-material/ArrowRightAlt';
import { useQuery } from 'react-query'
import * as React from 'react';
import { MenuItem } from '@mui/material';
// import NestedMenuItem from "material-ui-nested-menu-item";
import {NestedMenuItem} from 'mui-nested-menu';
import { AppContext } from "./Filter";
import {autocomplete_text_fields} from './var' 

import {useContext} from "react";
import {GlobalContext} from "../../App";

function Cascading() {

    const [menuPosition, setMenuPosition] = React.useState(null);
    const [option, setOption] = React.useState('');
    const {setOutput, output, labels, setLabels} = React.useContext(AppContext)
    const {options_tree} = useContext(GlobalContext);     // <--------- CONTEXT

    const handleClick = (e: React.MouseEvent) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const {search_object} = useContext(GlobalContext);

    function isChildren(key) {
        return key !== "type" && key !== "label" && key !== "flatlabel"
    }

    function isLast(node) {
        return Object.keys(node).length <= 3
    }

    const handleItemClick = (click) => {
        setMenuPosition(null);
      };
  
    const handleOptionClick = (option, type, flatlabel) => {
        if (option === "__id") option = "id"
        // setMenuPosition(null);
        handleClose();
        setOption(option);
        setLabels([...labels, {option:option, type:type, label:flatlabel}])

        var out = option + "***" + type + "***" + flatlabel;
        console.log("OUTPUT STRING: ----->", out)
        if(!search_object[option])
            setOutput([...output, out])                             // THIS IS THE OUTPUT AFTER USER SELECTS IN MENU
        else
            alert("The variable has been selected.")
        console.log("OUTPUT STRING ARRAY: ----->",output)
    }

    const handleLeftClick = (event) => {
        if (menuPosition) {
            return;
        }
        event.preventDefault();
        setMenuPosition({
            top: event.pageY,
            left: event.pageX
        });
    };

    const renderTree = (nodes, name) => {
        return (
             Object.keys(nodes).map((key) =>
                isChildren(key)
                    ? isLast(nodes[key])
                        // ? autocomplete_text_fields.includes(name.slice(2)+"__"+key) ? 
                        ? <MenuItem value={nodes[key].flatlabel} key={key} onClick={() => {handleOptionClick(name.slice(2)+"__"+key, nodes[key].type, nodes[key].flatlabel) }}>
                            {nodes[key].label}  
                        </MenuItem>
                            // : null
                        : <NestedMenuItem
                            key={nodes[key].label}
                            label={nodes[key].label}
                            parentMenuOpen={open}
                            onClick={handleClose}
                            > 
                            {renderTree(nodes[key], name+"__"+key)}
                        </NestedMenuItem>
                    : null
            )
        )
    };


    return (
        <Container>
            <Grid container >
                <Grid item xs={12}>

                    <TreeView
                        aria-label="option menu"
                        defaultCollapseIcon={<ExpandMoreIcon/>}
                        defaultExpandIcon={<ChevronRightIcon/>}
                    >
                        <Button
                            variant="contained"
                            onClick={handleClick}
                            >
                            New Filter
                        </Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            {renderTree(options_tree, "")}
                        </Menu>
                        
                    </TreeView>

                </Grid>
            
            </Grid>

    
        </Container>
    );
}

export default Cascading;

