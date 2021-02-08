import { SessionContext } from "./contexts/session";
import { SignInType } from "./types";

import { useSession } from "./hooks/session";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

interface ISessionProvider {
  children: any;
}

export function SessionProvider({ children }: ISessionProvider) {
  const [apiKey, setApiKey] = useState<string | undefined>();
  const [apiSecret, setApiSecret] = useState<string | undefined>();
  const { push } = useHistory();

  function signIn({ apiKey, apiSecret }: SignInType) {
    setApiKey(apiKey);
    setApiSecret(apiSecret);
    sessionStorage.setItem("api_key", apiKey);
    sessionStorage.setItem("api_secret", apiSecret);
    push("/");
  }

  function signOut() {
    sessionStorage.removeItem("api_key");
    sessionStorage.removeItem("api_secret");
    push("/login");
  }

  /* function generateJwt(): OpentokJWT | undefined {
    if (apiKey && apiSecret) {
      const currentTime = DateTime.utc().toMillis() / 1000;
      const expires = currentTime + 300; // 5 minutes expirity
      const accountJwt = generateToken(apiKey, apiSecret, "account",  expires);
      const projectJwt = generateToken(apiKey, apiSecret, "project", expires);
      return {
        account: accountJwt,
        project: projectJwt
      }
    } else return undefined;
  } */

  useEffect(
    () => {
      const apiKey = sessionStorage.getItem("api_key");
      const apiSecret = sessionStorage.getItem("api_secret");

      if (apiKey && apiSecret) {
        setApiKey(apiKey);
        setApiSecret(apiSecret);
      } else push("/login");
    },
    []
  )
  
  return (
    <SessionContext.Provider
      value={{
        apiKey,
        apiSecret,
        signIn,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export { useSession }
