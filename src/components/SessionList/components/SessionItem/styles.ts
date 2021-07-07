import { makeStyles } from "@material-ui/core";

export default makeStyles(() => ({
  tableCell: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: 175
  },
  tableRow: {
    cursor: "pointer"
  },
  selectedRow: {
    backgroundColor: "rgba(183, 121, 255, .5)",
    "& td": {
      fontWeight: "bolder"
    }
  }
}), { index: 1 });