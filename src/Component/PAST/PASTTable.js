import * as React from "react";
import ColSelector from "../VoyagePage/Result/Table/ColSelector";
import Table from "../VoyagePage/Result/Table/Table";

export const ColContext = React.createContext({});

export default function PASTTable(props) {
  const [cols, setCols] = React.useState([]);
  const { options_tree, endpoint } = React.useContext(props.context);
  console.log(endpoint);

  return (
    <div>
      {/* <Button onClick={()=>console.log("options_tree:", endpoint)}>print options_tree</Button> */}
      <ColContext.Provider value={{ cols, setCols, endpoint }}>
        <ColSelector context={ColContext} />
        <Table context={ColContext} />
      </ColContext.Provider>
    </div>
  );
}
