import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "./Filter";
import {GlobalContext} from "../../App";
const header={ "Authorization": 'Token f960287a8f35db0718fae95abc398a14a77ac1a3',
}

export default function Auto() {
 //console.log("🚀 ~ file: Autocomplete.js ~ line 10 ~ Auto ~ option", option)
 const { 
    setTestInput,
    labels,
    textInput,   
    value,
    setValue} = React.useContext(AppContext)

  const {search_object, set_search_object} = React.useContext(GlobalContext)
  const searchLabel = labels[labels.length-1]

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

      fetchData(searchLabel,textInput).catch(console.error)
    },[])

    React.useEffect(()=>{
      set_search_object(search_object=>({                     // <---------- UPDATE SEARCH OBJECT
        ...search_object,
        [searchLabel.option]: value
      }));
      console.log("🚀 ~ file: Autocomplete.js ~ line 64 ~ Auto ~ search_object", search_object)

    },[value])


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
        console.log("🚀 ~ file: Autocomplete.js ~ line 70 ~ Auto ~ value", value)
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
