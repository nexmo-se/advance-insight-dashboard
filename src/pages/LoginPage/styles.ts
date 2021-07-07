import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
  content: {
    overflow: "hidden",
    margin: "-24px -32px",
    padding: "24px 32px",
    position: "relative",
    height: "calc(100vh - 64px)"
  },
  logoBackground: {
    position: "absolute",
    bottom: "-25%",
    right: "5%",
    height: "100%"
  },
  card: {
    width: "auto",
    maxWidth: "45%",
    backgroundColor: "rgba(255, 255, 255, .95)",
    marginTop: theme.spacing(2)
  }
}), { index: 1 });
