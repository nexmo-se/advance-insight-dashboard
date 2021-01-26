import useStyles from "./styles";
import { Box } from "@material-ui/core";

interface IPageWrapper {
  children: any;
}

function PageWrapper({ children }: IPageWrapper) {
  const mStyles = useStyles();

  return (
    <Box className={mStyles.root}>
      {children}
    </Box>
  )
}

export default PageWrapper;
