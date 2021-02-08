import { createContext } from "react";
import { OpentokJWT, SignInType } from "../types";

type SessionContextType = {
  apiKey: string;
  apiSecret: string;
  signIn: (args: SignInType) => void;
  signOut: () => void;
  generateJwt: () => OpentokJWT | undefined;
}

export const SessionContext = createContext<Partial<SessionContextType>>({});
