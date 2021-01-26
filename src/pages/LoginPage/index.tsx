import React from "react";
import clsx from "clsx";

import IconPath from "@vonagevolta/volta2/dist/symbol/volta-icons.svg";
import VonageLogo from "@vonagevolta/volta2/images/logos/Vonage-lettermark.svg";

import useStyles from "./styles";
import { useSession } from "components/SessionProvider";
import { useState } from "react";

import Page from "components/Page";
import TextInput from "components/TextInput";
import Button from "components/Button";
import { Box } from "@material-ui/core";

function LoginPage() {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiSecret, setApiSecret] = useState<string>("");
  const { signIn } = useSession();

  const mStyles = useStyles();

  function handleSignInClick() {
    if (apiKey && apiSecret && signIn) signIn({ apiKey, apiSecret });
  }

  return (
    <Page>
      <img
        src={VonageLogo}
        alt="Vonage Logo"
        className={mStyles.logoBackground}
      />
      <Box
        className={
          clsx("Vlt-card", mStyles.card)
        }
      >
        <Box className="Vlt-card__header">
          <h3>Vonage Video Analytics Dashboard Template</h3>
        </Box>
        <Box
          className="Vlt-card__content"
          display="flex"
        >
          <Box width="50%">
            <TextInput
              label="Project API Key"
              value={apiKey}
              onChange={setApiKey}
            />
            <TextInput
              label="Project Secret"
              type="password"
              value={apiSecret}
              onChange={setApiSecret}
            />
            <Button.Primary 
              onClick={handleSignInClick}
              app
            >
              <svg><use xlinkHref={`${IconPath}#Vlt-icon-check`}/></svg>
              Sign-on
            </Button.Primary>
          </Box>
          <Box width="calc(50% - 16px)" ml={2}>
            <p>Template dashboard showcasing Vonage Video Data Analytics API capabilities</p>
          </Box>
        </Box>
      </Box>
    </Page>
  )
}

export default LoginPage;
