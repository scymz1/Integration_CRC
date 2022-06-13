import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "./Filter";
// import {autocomplete_text_fields, obj_autocomplete_text_fields} from './vars'
const header={ "Authorization": 'Token bd233c83dceb9a0f70ffd2b47d6cd3a18a095260',
}

export default function Auto() {
 const { 
    setTestInput,
    dropdownOptions,   
    value,
    setValue} = React.useContext(AppContext)

    console.log("Before returning autocomplete")

  return (

    <Autocomplete
      disablePortal
      autoHighlight
      multiple
      options={dropdownOptions}
      // value={dropdownOptions[0]}
      onChange={(event, newValue) => {
        setValue(oldArray => [newValue][0]);
        console.log(value)
      }}
      sx={{ width: 300 }}
      renderInput={(params) => {
        //params.inputProps.value is what i type in 
        //console.log("🚀 ~ file: Dropdown.js ~ line 108 ~ Dropdown ~ params", params.InputProps)
        setTestInput(params.inputProps.value)
        console.log("AUTOCOMPLETE OUTPUT: -----> ", dropdownOptions)
        return <TextField {...params} label="field" />
         
    }}
    />

  );
}
