import { DateTime } from "luxon";
import { SearchContext } from "./contexts/search";
import { SaveClickEvent } from "./types";

import { useState } from "react";
import { useSearch } from "./hooks/search";

import SearchCard from "./components/SearchCard";
import { Grid, Portal } from "@material-ui/core";

interface SearchAndFilterProps {
  children: any;
  container: any;
}

// selectedStartTime will start from 21 days before because of Tokbox retention period
function SearchAndFilter ({ children, container }: SearchAndFilterProps) {
  const [selectedSessionIds, setSelectedSessionIds] = useState<string[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState<DateTime>(DateTime.local().minus({ day: 21 }));
  const [selectedEndTime, setSelectedEndTime] = useState<DateTime>(DateTime.local());
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | undefined>();

  function handleSaveClick({ sessionIds, startTime, endTime }: SaveClickEvent) {
    setSelectedSessionIds(sessionIds);
    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
  }

  return (
    <SearchContext.Provider
      value={{
        meetingId: selectedMeetingId,
        sessionIds: selectedSessionIds,
        startTime: selectedStartTime,
        endTime: selectedEndTime,
        setSessionIds: setSelectedSessionIds,
        setMeetingId: setSelectedMeetingId
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
