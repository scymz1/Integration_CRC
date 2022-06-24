import * as React from "react";
import PAST from "./PAST";

const auth_token = process.env.REACT_APP_AUTHTOKEN
const base_url = process.env.REACT_APP_BASEURL;

export const PASTContext = React.createContext({});

export default function PASTApp(props) {
  const [originTarget, setOriginTarget] = React.useState(3);
  const [isSlave, setIsSlave] = React.useState(true);

  return (
    <PASTContext.Provider value={{originTarget, setOriginTarget, isSlave, setIsSlave}}>
      <PAST/>
    </PASTContext.Provider>
  )
}