import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {VoyageContext} from "../VoyageApp";


export default function RadioButton() {
  const {search_object, set_search_object} = React.useContext(VoyageContext);

  const handleChange = (event) => {
    var rest = search_object;
    if('dataset' in search_object){
      var {dataset, ...rest} = search_object;
    }
    if(event.target.value=="Trans-Atlantic"){
      set_search_object({'dataset':[0, 0], ...rest});
    }
    else{
      set_search_object({'dataset':[1, 1], ...rest});
    }
  };

  return (
    <FormControl>
      <FormLabel id="radio-button">Radio button</FormLabel>
      <RadioGroup
        onChange={handleChange}
      >
        <FormControlLabel value="Trans-Atlantic" control={<Radio />} label="Trans-Atlantic" />
        <FormControlLabel value="Intra-American" control={<Radio />} label="Intra-American" />
      </RadioGroup>
    </FormControl>
  );
}
