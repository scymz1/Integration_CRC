import * as React from 'react';
import { ColContext } from './TableApp';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import { CardHeader, MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useContext } from 'react';
import { columnOptions } from './tableVars';
import * as options_flat from "../../../util/options.json"

import { NestedMenuItem } from '../../Filter/NestedMenuItem';
import ExpandMoreIcon from '@mui/icons-material/ArrowRightAlt';
// import {ChevronRightIcon} from '../../Filter/ChevronRight'
import ChevronRightIcon from '@mui/icons-material/ArrowRightAlt';
import { Button, Grid } from '@mui/material';
import { TreeView } from '@mui/lab';
import { Menu } from '@mui/material';
import { Container } from '@mui/system';
import { styled } from '@mui/system';
// export const ColContext = React.createContext({});
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { filter } from 'lodash';
import hierFalse2True from '../../../util/hierFalse2True';
import { Key } from '@mui/icons-material';
import nameConcat from '../../../util/nameConcat';


export default function ColSelector11(props) {
    const {cols, setCols, columnOptions, options_flat} = useContext(props.context)
    const [chipData, setChipData] = React.useState([]);
    React.useEffect(()=>{
        if (cols.length > 0) {
            cols.forEach((v) => {setChipData([...chipData, {key:v, label:options_flat[v].flatlabel}]) })
        }
        console.log("chipdata", chipData)
    },[])   
    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));
    const handleClick = (e) => { console.log("Handle Option Click"); setAnchorEl(e.currentTarget); console.log(open)}
    const handleClose = () => setAnchorEl(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        setCols(
      // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
        );
    };

    function isChildren(key) {
        console.log("ischildren", key)
        if (key) return true;
        else return false
    }

    function isLast(node) {
        console.log("islast", node)
        // return Object.keys(node).length <= 3 
        return node === null
    }

    function isInColList(name) {
        // console.log("collist", name)
        // if (name === "__id") name = "id"
        console.log("collist", name)
        return columnOptions.includes(name)
    }

    const handleOptionClick = (option) => {
        console.log("optionclick", option)
        // if (option === "__id") option = "id"
        // setMenuPosition(null);
        if (cols.includes(option) === false) {
            setCols([...cols, option])
            setChipData([...chipData, {key: option, label: options_flat[option].flatlabel}])

        }
        // console.log(chipData)
        handleClose();
        // setOption(option); 
        // setLabels([...labels, {option:option, type:type, label:flatlabel}])
    }

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
        // add delete target
        setCols((cols) => cols.filter((col) => col !== chipToDelete.key))
      };

    const renderTree = (nodes, name) => {
        return (
            Object.keys(nodes).map((key) =>
                isChildren(key)
                    ? isLast(nodes[key])
                        // ? isInColList(key)
                            ? <MenuItem value={key} key={key} onClick={() => {handleOptionClick(key)}}>
                                {options_flat[key].flatlabel}
                            </MenuItem>
                            // :null
                        : <NestedMenuItem
                            key={key}
                            // label={options_flat[nameConcat(name,key)].label}
                            label = {options_flat[key].label}
                            parentMenuOpen={open}
                            onClick={handleClose}
                            > 
                            {renderTree(nodes[key],key)}
                        </NestedMenuItem>
                    : null
                )   
            )
    };


    return (
        <div>
            {/* <Paper
                sx={{
                display: 'flex',
                justifyContent: 'left',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
                }}
                component="ul"
            > */}
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <TreeView
                        aria-label="option menu"
                        defaultCollapseIcon={<ExpandMoreIcon/>}
                        defaultExpandIcon={<ChevronRightIcon/>}
                    >
                        <Button 
                                variant="text"
                                onClick={handleClick}
                                >
                                    {"Column Selector"}
                        </Button>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                            {/* {renderTree(hierFalse2True(columnOptions),"")} */}
                            {renderTree(columnOptions,"")}
                        </Menu>
                    </TreeView>
                </Grid>
            {/* </Grid>
            <Grid container spacing = {2}> */}
                <Grid container item xs={9}>
                    {chipData.map((data) => {
                    return (
                        <ListItem key={data.key}>
                            <Chip
                            label={data.label}
                            onDelete={data.key === 'id' ? undefined : handleDelete(data)}
                            />
                        </ListItem>
                    );
                 })}
                </Grid>
            </Grid>
                {/* </Paper> */}
        </div>
    );
}
