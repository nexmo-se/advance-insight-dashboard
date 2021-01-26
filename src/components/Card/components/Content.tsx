import clsx from "clsx";
import { Box } from "@material-ui/core";

interface IContent {
  children: any;
  className?: string[];
}

function Content({ children, className = [] }: IContent) {
  return (
    <Box
      className={
        clsx("Vlt-card__content", ...className)
      }
    >
      {children}
    </Box>
  )
}

export default Content;