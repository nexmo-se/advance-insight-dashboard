import useStyles from "./styles";
import { Box } from "@material-ui/core";

interface IMainContent {
  children: any;
}

function MainContent({ children }: IMainContent) {
  const mStyles = useStyles();

  return (
    <Box className={mStyles.root}>
      {children}
    </Box>
  )
}

export default MainContent;
