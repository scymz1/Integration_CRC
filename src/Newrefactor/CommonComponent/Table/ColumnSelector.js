import * as React from 'react';
import { MenuItem } from '@mui/material';
import { NestedMenuItem } from '../../Util/NestedMenuItem';
import ExpandMoreIcon from '@mui/icons-material/ArrowRightAlt';
import ChevronRightIcon from '@mui/icons-material/ArrowRightAlt';
import { Button, Grid } from '@mui/material';
import { TreeView } from '@mui/lab';
import { Menu } from '@mui/material';
import { styled } from '@mui/system';
import { useWindowSize } from "@react-hook/window-size";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';

export default function ColSelector(props) {
    const [width, height] = useWindowSize();

    const { columnVisibilityModel, setColumnVisibilityModel, variables_tree, options_flat } = props.state
    const handleClick = (e) => { setAnchorEl(e.currentTarget) }
    const handleClose = () => setAnchorEl(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    function isChildren(key) {
        if (key) return true;
        else return false
    }

    function isLast(node) {
        return node === null
    }

    function containsOnly(node) {
        if (Object.keys(node).length === 1)
            return true;
        return false;
    }

    const handleOptionClick = (option) => {
        console.log("click", option, options_flat[option].flatlabel)
        setColumnVisibilityModel({...columnVisibilityModel, [option]: true})
        handleClose();
    }

    // const handleDelete = (chipToDelete) => () => {
    //     setCols((cols) => cols.filter((col) => col !== chipToDelete))
    // };

    const renderTree = (nodes) => {
        return (
            Object.keys(nodes).map((key) =>
                isChildren(key)
                    ? isLast(nodes[key])
                        ? <MenuItem value={key} key={key} onClick={() => { handleOptionClick(key) }}>
                            {options_flat[key].flatlabel}
                        </MenuItem>
                        : containsOnly(nodes[key])
                            ? renderTree(nodes[key])
                            : <NestedMenuItem
                                key={key}
                                label={options_flat[key].flatlabel}
                                parentMenuOpen={open}
                                onClick={handleClose}
                            >
                                {renderTree(nodes[key])}
                            </NestedMenuItem>
                    : null
            )
        )
    };


    return (
        <div>
            <Button startIcon={<ViewWeekIcon/>} onClick={handleClick}>Columns</Button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <TreeView
                  aria-label="option menu"
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                >
                    {renderTree(variables_tree)}
                </TreeView>

            </Menu>
        </div>
    );
}