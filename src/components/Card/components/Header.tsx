import clsx from "clsx";
import { Box } from "@material-ui/core";

interface IHeader {
  children: any;
  className?: string[];
}

function Header({ children, className = [] }: IHeader) {
  return (
    <Box
      className={
        clsx("Vlt-card__header", ...className)
      }
    >
      {children}
    </Box>
  )
}

export default Header;