import VonageTokboxLogo from "@vonagevolta/volta2/images/logos/Vonage-tokbox--white.svg";

import clsx from "clsx";
import useStyles from "./styles";

function Header() {
  const mStyles = useStyles();

  return (
    <header
      className={clsx(
        mStyles.root,
        "Vlt-bg-black"      
      )}
    >
      <a
        href="#"
        className={mStyles.logoContainer}
      >
        <img
          className={mStyles.logo}
          src={VonageTokboxLogo}
          alt="Vonage Logo"
        />
      </a>
    </header>
  )
}

export default Header;
