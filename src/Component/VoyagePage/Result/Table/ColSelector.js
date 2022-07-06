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
import Table from './Table';
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

const colNames = [
    "voyage_itinerary",
    "voyage_slaves_numbers__imp_total_num_slaves_embarked",
    "voyage_itinerary__first_landing_region__geo_location__name",
    "voyage_itinerary__imp_broad_region_voyage_begin__geo_location__name",
];

function getStyles(name, cols, theme) {
  return {
    fontWeight:
      cols.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

// export const ColContext = React.createContext({});

export default function ColSelector() {
  const theme = useTheme();
  // const [cols, setCols] = React.useState(["id"]);
  const {cols, setCols} = useContext(ColContext)

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
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
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
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {colNames.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, cols, theme)}
            >
              {name}
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
