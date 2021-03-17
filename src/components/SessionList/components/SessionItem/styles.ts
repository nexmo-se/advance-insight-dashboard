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
    backgroundColor: "#f3e9ff"
  }
}), { index: 1 });