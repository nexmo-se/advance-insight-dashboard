import { makeStyles } from "@material-ui/core";

export default makeStyles(() => ({
  root: {
    alignItems: "center",
    background: "#fff",
    display: "flex",
    flex: "0 0 100%",
    height: 64,
    justifyContent: "space-between",
    padding: "14px 24px",
    transition: "height .5s",
    width: "100%",
    zIndex: 700
  },
  logoContainer: {
    display: "block",
    flex: "0 0 270px"
  },
  logo: {
    height: 24
  }
}), { index: 1 })