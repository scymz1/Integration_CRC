import * as React from "react";
import ColSelector from "../VoyagePage/Result/Table/ColSelector";
import Table from "../VoyagePage/Result/Table/Table";
//import Button from "@mui/material/Button";
import { enslaved_default_list, enslaved_var_list } from "./vars";
import * as labels from "../util/enslaved_options.json";

export const ColContext = React.createContext({});

export default function PASTTable(props) {
  const [cols, setCols] = React.useState(enslaved_default_list);
  const { options_tree, endpoint } = React.useContext(props.context);
  //console.log(endpoint);
  //console.log(cols);

  return (
    <div>
      {/* <Button onClick={()=>console.log("options_tree:", cols)}>print options_tree</Button> */}
      <ColContext.Provider
        value={{
          cols,
          setCols,
          endpoint,
          checkbox: true,
          modal: false,
          columnOptions: enslaved_var_list,
          options_flat: labels,
        }}
      >
        <ColSelector context={ColContext} />
        <Table context={ColContext} />
      </ColContext.Provider>
    </div>
  );
}
