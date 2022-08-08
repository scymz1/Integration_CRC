import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { useContext } from 'react';
import { ColContext } from './TableApp';
//import { columnOptions } from './tableVars';
//import * as options_flat from "../../../util/options.json"
import Cascading from '../../Filter/Cascading';
import {menu_label} from '../../Filter/var'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function getStyles(name, cols, theme) {
  return {
    fontWeight:
      cols.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// export const ColContext = React.createContext({});

export default function ColSelector(props) {
  const theme = useTheme();
  // const [cols, setCols] = React.useState(["id"]);
  // const {cols, setCols} = useContext(ColContext)
  const {
    cols, setCols, columnOptions, options_flat 
} = React.useContext(props.context)

  //console.log(options_flat);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCols(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 800 }}>
        <InputLabel id="demo-multiple-chip-label">Column Selector</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={cols}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={options_flat[value].flatlabel} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {columnOptions.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, cols, theme)}
            >
              {options_flat[name].flatlabel}
            </MenuItem>
          ))}
          
        </Select>
      </FormControl>

        {/* <ColContext.Provider value={{cols}}>
          <Table/>
        </ColContext.Provider> */}
      
    </div>
  );
}
