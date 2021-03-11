import { createContext, Dispatch, SetStateAction } from "react";
import { DateTime } from "luxon";

type SearchContextType = {
  meetingId?: string;
  sessionIds: string[];
  startTime: DateTime;
  endTime: DateTime;
  setSessionIds: Dispatch<SetStateAction<string[]>>;
  setMeetingId: Dispatch<SetStateAction<string | undefined>>;
}

export const SearchContext = createContext<SearchContextType>({} as SearchContextType);
