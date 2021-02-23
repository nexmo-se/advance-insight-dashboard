import { createContext } from "react";
import { SignInType } from "../types";

type SessionContextType = {
  apiKey: string;
  apiSecret: string;
  signIn: (args: SignInType) => void;
  signOut: () => void
}

// Assuming I only access `useSession` inside `SessionProvider`
export const SessionContext = createContext<SessionContextType>({} as SessionContextType);
