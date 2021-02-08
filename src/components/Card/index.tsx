import clsx from "clsx";

import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";
import { Box } from "@material-ui/core";

interface ICard {
  children: any;
  className?: string[]
}

function Card({ children, className = []}: ICard) {
  return (
    <Box
      className={
        clsx("Vlt-card", ...className)
      }
    >
      {children}
    </Box>
  )
}

Card.Header = Header;
Card.Content = Content;
Card.Footer = Footer;
export default Card;