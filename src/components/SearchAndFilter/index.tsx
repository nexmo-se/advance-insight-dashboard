import { DateTime } from "luxon";
import { SearchContext } from "./contexts/search";
import { SaveClickEvent } from "./types";

import { RefObject, useEffect, useState } from "react";
import { useSearch } from "./hooks/search";

import SearchCard from "./components/SearchCard";
import { Grid, Portal } from "@material-ui/core";

interface ISearchAndFilter {
  children: any;
  container: any;
}

function SearchAndFilter ({ children, container }: ISearchAndFilter) {
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<DateTime>(DateTime.local().minus({ day: 7 }));
  const [selectedEndTime, setSelectedEndTime] = useState<DateTime>(DateTime.local());

  function handleSaveClick({ sessionIds, startTime, endTime }: SaveClickEvent) {
    setSelectedSessionIds(sessionIds);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  }

  useEffect(() => console.log(container))

  return (
    <SearchContext.Provider
      value={{
        sessionIds: selectedSessionIds,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        setSessionIds: setSelectedSessionIds
      }}
    >
      <Grid spacing={2} container>
        <Grid xs={12} item>
          <SearchCard onSaveClick={handleSaveClick} />
        </Grid>
      </Grid>

      <Portal container={container}>
        {children}
      </Portal>
    </SearchContext.Provider>
  )
}

export { useSearch };
export default SearchAndFilter;
