import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function RadioButton() {
  const [radio, setRadio] = React.useState("Trans-Atlantic");

  const handleChange = (event) => {
    setRadio(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="radio-button">Radio button</FormLabel>
      <RadioGroup
        value={radio}
        onChange={handleChange}
      >
        <FormControlLabel value="Trans-Atlantic" control={<Radio />} label="Trans-Atlantic" />
        <FormControlLabel value="Intra-American" control={<Radio />} label="Intra-American" />
      </RadioGroup>
    </FormControl>
  );
}
