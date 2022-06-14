import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "./Filter";
// import {autocomplete_text_fields, obj_autocomplete_text_fields} from './vars'
const header={ "Authorization": 'Token bd233c83dceb9a0f70ffd2b47d6cd3a18a095260',
}

export default function Auto() {
 //console.log("🚀 ~ file: Autocomplete.js ~ line 10 ~ Auto ~ option", option)
 const { 
    setAutoInput,
    autocompleteOptions,   
    value,
    setValue} = React.useContext(AppContext)
    console.log("🚀 ~ file: Autocomplete.js ~ line 16 ~ Auto ~ autocompleteOptions", autocompleteOptions)

    console.log("Before returning autocomplete")

  return (

    <Autocomplete
      disablePortal
      autoHighlight
      multiple
      options={autocompleteOptions}
      //options={option}
      onChange={(event, newValue) => {
        setValue(oldArray => [newValue][0]);
        console.log(value)
      }}
      sx={{ width: 300 }}
      renderInput={(params) => {
        setAutoInput(params.inputProps.value)
        return <TextField {...params} label="field" />
         
    }}
    />

  );
}
