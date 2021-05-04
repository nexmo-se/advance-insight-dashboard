import SessionData from "../../models/session-data";
import { ApolloError } from "@apollo/client";
import { createContext } from "react";

import { useContext } from "react";
import { useSessionData } from "../../hooks/session-data";

interface SessionListContextProps {
  loading: boolean;
  error: ApolloError | undefined;
  sessions: SessionData[];
  loadMore: () => void;
  hasNext: boolean;
}

interface SessionListProviderProps {
  children: any;
}

export const SessionListContext = createContext<SessionListContextProps>({} as SessionListContextProps)

function SessionListProvider ({ children }: SessionListProviderProps) {
  const { loading, error, sessions, loadMore, hasNext } = useSessionData();

  return (
    <SessionListContext.Provider
      value={{
        loading,
        error,
        sessions,
        loadMore,
        hasNext
      }}
    >
      {children}
    </SessionListContext.Provider>
  )
}

export function useSessionList () {
  return useContext(SessionListContext);
}

export default SessionListProvider;
