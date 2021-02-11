import { createContext } from "react";
import { SignInType } from "../types";

type SessionContextType = {
  apiKey: string;
  apiSecret: string;
  signIn: (args: SignInType) => void;
  signOut: () => void
}

export const SessionContext = createContext<Partial<SessionContextType>>({});
