import { Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// check if the string is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// create popover for enslaver alias in enslaved table
const createPopover = (row) => {
  const people = row[
    "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
  ]
    ? row[
        "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias"
      ].flat(Infinity)
    : [];
  const roles = row["transactions__transaction__enslavers__role__role"]
    ? row["transactions__transaction__enslavers__role__role"].flat(Infinity)
    : [];
  const ids = row[
    "transactions__transaction__enslavers__enslaver_alias__identity__id"
  ]
    ? row[
        "transactions__transaction__enslavers__enslaver_alias__identity__id"
      ].flat(Infinity)
    : [];
  const output = {};
  for (let i = 0; i < people.length; i++) {
    if (!(people[i] in output)) {
      output[people[i]] = { roles: [], id: 0 };
    }
    output[people[i]]["roles"].push(roles[i]);
    output[people[i]]["id"] = ids[i];
  }
  return output;
};

export default function Cell(props) {
  const { row, field } = props;
  switch (field) {
    case "id":
      return <Button onClick={() => alert(row.id)}>{row.id}</Button>;
    case "gender":
      if (isNumeric(row.gender)) {
        return <div>{row.gender === 1 ? "Male" : "Female"}</div>;
      }
      return row.gender;
    case "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias":
      const popover = createPopover(row);
      return(
      <Stack direction="row" spacing={1}>
        {Object.keys(popover).map((name, key) => (
          <Tooltip
            key={"tooltip-" + key}
            arrow
            title={popover[name]["roles"].join(", ")}
            placement="top"
          >
            <Chip
              label={name}
              // onClick={(e) =>
              //   handleSankeyOpen(e, [popover[name]["id"]], "enslavers")
              // }
            />
          </Tooltip>
        ))}
      </Stack>)
    default:
      return row[field];
  }
}
