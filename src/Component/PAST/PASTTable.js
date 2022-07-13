import * as React from "react";
import ColSelector from "../VoyagePage/Result/Table/ColSelector";
import Table from "../VoyagePage/Result/Table/Table";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";

import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { enslaved_default_list, enslaved_var_list } from "./vars";
import * as labels from "../util/enslaved_options.json";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
  minHeight: 32,
}));

export const ColContext = React.createContext({});

export default function PASTTable(props) {
  const [cols, setCols] = React.useState(enslaved_default_list);
  const { options_tree, endpoint, queryData, setQueryData, search_object } = React.useContext(props.context);
  const [chipData, setChipData] = React.useState([
    { id: 1, documented_name: "jQuery" },
    { id: 2, documented_name: "Polymer" },
    { id: 3, documented_name: "Vue.js" },
    { id: 5, documented_name: "jQuery" },
    { id: 6, documented_name: "Polymer" },
    { id: 7, documented_name: "React" },
    { id: 8, documented_name: "Vue.js" },
    { id: 11, documented_name: "jQuery" },
    { id: 12, documented_name: "Polymer" },
    { id: 13, documented_name: "Vue.js" },
    { id: 15, documented_name: "jQuery" },
    { id: 16, documented_name: "Polymer" },
    { id: 17, documented_name: "React" },
    { id: 18, documented_name: "Vue.js" },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.id !== chipToDelete.id));
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
          queryData, setQueryData,
          search_object,
        }}
      >
        <ColSelector context={ColContext} />
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
              {chipData.map((data) => {
                return (
                  <Grid item key={data.id}>
                    <Chip
                      label={data.documented_name}
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
