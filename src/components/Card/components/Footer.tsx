import clsx from "clsx";
import { Box } from "@material-ui/core";

interface IContent {
  children: any;
  className?: string[];
  noborder?: boolean;
}

function Footer({ noborder, children, className = [] }: IContent) {
  return (
    <Box
      className={
        clsx({
          "Vlt-card__footer": true,
          "Vlt-card__footer--noborder": noborder,
          ...className
        })
      }
    >
      {children}
    </Box>
  )
}

export default Footer;