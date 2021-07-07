import { makeStyles } from "@material-ui/core";

export default makeStyles(
  () => ({
    root: {
      height: "calc(100vh - 64px)",
      backgroundColor: "#f3f3f5",
      overflowY: "auto",
      padding: "24px 32px",
      flex: 1
    },
  }),
  { index: 1 }
)