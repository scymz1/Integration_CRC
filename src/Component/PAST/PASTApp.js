import * as React from "react";
import PAST from "./PAST";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const PASTContext = React.createContext({});

export default function PASTApp(props) {
  const [target, setTarget] = React.useState("Molly");

  return (
    <PASTContext.Provider value={{target, setTarget}}>
      <PAST/>
    </PASTContext.Provider>
  )
}