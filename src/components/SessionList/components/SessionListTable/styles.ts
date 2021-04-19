import { makeStyles } from "@material-ui/core";

export default makeStyles(() => ({
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