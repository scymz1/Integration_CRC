import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "./Filter";
const header={ "Authorization": 'Token bd233c83dceb9a0f70ffd2b47d6cd3a18a095260',
}

export default function Auto() {
 //console.log("🚀 ~ file: Autocomplete.js ~ line 10 ~ Auto ~ option", option)
 const { 
    setTestInput,
    labels,
    textInput,   
    value,
    setValue} = React.useContext(AppContext)

  const [autocompleteOptions, setautocompleteOptions] = React.useState([]);

    React.useEffect(()=>{
      console.log('use effect fetch dropdown options')
      const fetchData = async (labels,textInput) => {
      //   console.log("Labels.option: ----->", labels.option)
        var formdata = new FormData();
        formdata.append(labels.option, textInput);

        //console.log("🚀 ~ label, textInput", label, textInput)
        var requestOptions = {
            method: 'POST',
            headers: header,
            body: formdata,
            redirect: 'follow'
        };
        fetch("https://voyages3-api.crc.rice.edu/voyage/autocomplete", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log("🚀YAYAYAY fetch is successful!!! result", result)
            var newOptions = result[labels.option]
            console.log("🚀 ~ file: Dropdown.js ~ line 43 ~ fetchData ~ newOptions", newOptions)
            setautocompleteOptions(newOptions) })
      }

      fetchData(labels[labels.length-1],textInput).catch(console.error)
    },[])


  return (

    <Autocomplete
      disablePortal
      autoHighlight
      multiple
      options={autocompleteOptions}
      // value={dropdownOptions[0]}
      onChange={(event, newValue) => {
        setValue(oldArray => [newValue][0]);
        console.log(value)
      }}
      sx={{ width: 300 }}
      renderInput={(params) => {

        setTestInput(params.inputProps.value)
        console.log("AUTOCOMPLETE OUTPUT: -----> ", value)
        console.log('AUTOCOMPLETE FIELD: ----->', labels)
        return <TextField {...params} label="field" />
         
    }}
    />

  );
}
