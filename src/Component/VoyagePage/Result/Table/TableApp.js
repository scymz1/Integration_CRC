import ColSelector from "./ColSelector";
import ColSelector11 from "./ColSelector11";
import Table from "./Table";
import Modal from "./TableModal";
import React, { useState, useContext } from "react";
import { columnOptions } from "./tableVars";
import * as labels from "../../../util/options.json";
import { VoyageContext } from "../../VoyageApp";

export const ColContext = React.createContext({});

function TableApp(props) {
  const [cols, setCols] = React.useState([
    "id",
    "voyage_slaves_numbers__imp_total_num_slaves_embarked",
  ]);
  const { endpoint } = React.useContext(props.context);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [info, setInfo] = useState([]);
  const { search_object } = useContext(VoyageContext);

  return (
    <div>
      {/* <Button onClick={()=>console.log("options_tree:", endpoint)}>print options_tree</Button> */}
      <ColContext.Provider
        value={{
          cols,
          setCols,
          endpoint,
          checkbox: false,
          modal: true,
          id,
          setId,
          open,
          setOpen,
          info,
          setInfo,
          columnOptions,
          options_flat: labels,
          search_object,
        }}
      >
        <ColSelector11 context={ColContext} />
        <Table context={ColContext} />
        <Modal context={ColContext} endpoint="voyage/" />
      </ColContext.Provider>
    </div>
  );
}
export default TableApp;
