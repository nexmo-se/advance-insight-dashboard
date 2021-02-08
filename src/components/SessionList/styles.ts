import { makeStyles } from "@material-ui/core";

export default makeStyles(() => ({
  tableCell: {
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: 175
  },
  tableFixHead: {
    overflowY: "auto",
    maxHeight: 350,

    "& thead th": {
      position: "sticky",
      top: 0,
      background: "white"
    }
  }
}), { index: 1 });