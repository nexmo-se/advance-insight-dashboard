import { SessionContext } from "./contexts/session";
import { SignInType } from "./types";

import { useSession } from "./hooks/session";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

interface ISessionProvider {
  children: any;
}

export function SessionProvider({ children }: ISessionProvider) {
  const [apiKey, setApiKey] = useState<string>("");
  const [apiSecret, setApiSecret] = useState<string>("");
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

  useEffect(
    () => {
      const apiKey = sessionStorage.getItem("api_key");
      const apiSecret = sessionStorage.getItem("api_secret");

      if (apiKey && apiSecret) {
        setApiKey(apiKey);
        setApiSecret(apiSecret);
      } else push("/login");
    },
    [push]
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
