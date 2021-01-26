import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
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
