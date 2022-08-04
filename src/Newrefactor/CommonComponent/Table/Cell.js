import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

export default function Cell(props) {
  const { row, field } = props;
  switch (field) {
    case "gender":
      return genderCell(row[field]);
    case "transactions__transaction__enslavers__enslaver_alias__identity__principal_alias":
      return aliasCell(row, props);
    case "transactions__transaction__voyage__id":
      return voyageIdCell(row[field]);
    case typeof row[field] === "object":
      return objectCell(row[field]);
    default:
      return row[field];
  }
}

// check if the string is numeric
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// popover event & open sankey modal in past table
const handleSankeyOpen = (e, id, variety, props) => {
  props.setSelectedData({
    ...props.selectedData,
    [variety]: id,
    type: variety,
  });
  props.handleDialogOpen();
  console.log(id);
  e.stopPropagation();
};

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

// gender cell
function genderCell(gender) {
  if (isNumeric(gender)) {
    return gender === 1 ? "Male" : "Female";
  }
  return gender;
}

// alias cell
function aliasCell(row, props) {
  const popover = createPopover(row);
  return (
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
            onClick={(e) =>
              handleSankeyOpen(e, [popover[name]["id"]], "enslavers", props)
            }
          />
        </Tooltip>
      ))}
    </Stack>
  );
}

// voyage id cell
function voyageIdCell(ids) {
  return (
    <div style={{ color: "blue" }}>
      <u>{[...new Set(ids)].filter((n) => n != null).join(", ")}</u>
    </div>
  );
}

// object cell
function objectCell(obj) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: [...new Set([].concat.apply([], obj))]
          .join("<br>")
          .replaceAll("</p>,<p>", "</p><p>"),
      }}
    />
  );
}
