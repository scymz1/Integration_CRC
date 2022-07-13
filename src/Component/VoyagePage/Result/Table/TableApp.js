import ColSelector from "./ColSelector";
import Table from "./Table";
import Modal from "./TableModal";
import React, { useState } from "react";
export const ColContext = React.createContext({});

function TableApp(props) {
  const [cols, setCols] = React.useState(["id"]);
  const { endpoint } = React.useContext(props.context);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(0);
  const [info, setInfo] = useState([]);

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
        }}
      >
        <ColSelector context={ColContext} />
        <Table context={ColContext} />
        <Modal context={ColContext} />
      </ColContext.Provider>
    </div>
  );
}
export default TableApp;
