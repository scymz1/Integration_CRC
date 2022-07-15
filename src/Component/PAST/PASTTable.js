import * as React from "react";
import ColSelector from "../VoyagePage/Result/Table/ColSelector";
import Table from "../VoyagePage/Result/Table/Table";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
//import Button from "@mui/material/Button";
//import { Typography } from "@mui/material";
//import { styled } from "@mui/material/styles";
import * as labels from "../util/enslaved_options.json";
import ColSelector11 from "../VoyagePage/Result/Table/ColSelector11";
import { enslaved_default_list, enslaved_var_list } from "./vars";

export const ColContext = React.createContext({});
export default function PASTTable(props) {
  const [cols, setCols] = React.useState(enslaved_default_list);

  const { options_tree, endpoint, queryData, setQueryData, search_object } =
    React.useContext(props.context);
  const [chipData, setChipData] = React.useState({});

  const handleDelete = (chipToDelete) => () => {
    //setChipData((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
    delete chipData[chipToDelete];
    setQueryData({ ...queryData, targets: Object.keys(chipData).map(Number) });
  };

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
          queryData,
          setQueryData,
          search_object,
          chipData,
          setChipData,
        }}
      >
        <ColSelector11 context={ColContext} />
        <Card
          sx={{
            width: 800,
            //display: "flex",
            //justifyContent: "center",
            //flexWrap: "wrap",
            //listStyle: "none",
            // gap: 0.5,
            m: 1,
          }}
        >
          <CardHeader
            titleTypographyProps={{
              fontSize: 18,
              height: 5,
            }}
            title="Select items (MAX = 10)"
          />
          <CardContent>
            <Grid container spacing={1}>
              {Object.keys(chipData).map((data) => {
                return (
                  <Grid item key={data}>
                    <Chip
                      label={chipData[data] + " (" + data + ")"}
                      onDelete={handleDelete(data)}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
          {/* <Button
            variant="outlined"
            sx={{
              m: 1,
              height: 32,
            }}
          >
            SHOW NETWORKS
          </Button> */}
        </Card>
        <Table context={ColContext} />
      </ColContext.Provider>
    </div>
  );
}
