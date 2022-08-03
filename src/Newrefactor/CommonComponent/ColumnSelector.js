import * as React from 'react';
import { MenuItem } from '@mui/material';
import Chip from '@mui/material/Chip';
import { NestedMenuItem } from '../Util/NestedMenuItem';
import ExpandMoreIcon from '@mui/icons-material/ArrowRightAlt';
import ChevronRightIcon from '@mui/icons-material/ArrowRightAlt';
import { Button, Grid } from '@mui/material';
import { TreeView } from '@mui/lab';
import { Menu } from '@mui/material';
import { styled } from '@mui/system';
import { Container } from "@mui/material";
import { useWindowSize } from "@react-hook/window-size";


export default function ColSelector(props) {
    const [width, height] = useWindowSize();

    const { cols, setCols, variables_tree, options_flat } = props.state
    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));
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
        if (cols.includes(option) === false) {
            setCols([...cols, option])
        }
        handleClose();
    }

    const handleDelete = (chipToDelete) => () => {
        setCols((cols) => cols.filter((col) => col !== chipToDelete))
    };

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
            <Container maxWidth={false}>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Grid item sx={{ width: width > 800 ? width * 0.9 : width * 0.7 }}>
                        <Grid container item>
                            <TreeView
                                aria-label="option menu"
                                defaultCollapseIcon={<ExpandMoreIcon />}
                                defaultExpandIcon={<ChevronRightIcon />}
                            >

                                <Button
                                    variant="contained"
                                    size="large"
                                    color="grey"
                                    onClick={handleClick}
                                >
                                    {"Column Selector"}

                                </Button>
                                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                    {renderTree(variables_tree)}
                                </Menu>
                            </TreeView>
                            {cols.map((data) => {
                                return (
                                    <ListItem key={data} style={{ listStyleType: 'none' }}>
                                        <Chip
                                            label={options_flat[data].flatlabel}
                                            onDelete={data === 'id' ? undefined : handleDelete(data)}
                                        />
                                    </ListItem>
                                );
                            })}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}