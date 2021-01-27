import { createContext } from "react";
import { DateTime } from "luxon";

type SearchContextType = {
  sessionIds?: string[];
  startTime: DateTime;
  endTime: DateTime;
}

export const SearchContext = createContext<SearchContextType>({
  startTime: DateTime.local().minus({ day: 7 }),
  endTime: DateTime.local(),
  sessionIds: []
});
