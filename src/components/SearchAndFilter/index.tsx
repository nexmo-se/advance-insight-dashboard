import { DateTime } from "luxon";
import { SearchContext } from "./contexts/search";
import { SaveClickEvent } from "./types";

import { useState } from "react";
import { useSearch } from "./hooks/search";

import SearchCard from "./components/SearchCard";

interface ISearchAndFilter {
  children: any;
}

function SearchAndFilter({ children }: ISearchAndFilter) {
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<DateTime>(DateTime.local().minus({ day: 7 }));
  const [selectedEndTime, setSelectedEndTime] = useState<DateTime>(DateTime.local());

  function handleSaveClick({ sessionIds, startTime, endTime }: SaveClickEvent) {
    setSelectedSessionIds(sessionIds);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  }

  return (
    <SearchContext.Provider
      value={{
        sessionIds: selectedSessionIds,
        startTime: selectedStartTime,
        endTime: selectedEndTime
      }}
    >
      <SearchCard onSaveClick={handleSaveClick} />
      {children}
    </SearchContext.Provider>
  )
}

export { useSearch };
export default SearchAndFilter;
