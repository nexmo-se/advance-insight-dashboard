import { DateTime } from "luxon";
import { SearchContext } from "./contexts/search";

import { useState } from "react";
import { useSearch } from "./hooks/search";

import Card from "components/Card";

interface ISearchAndFilter {
  children: any;
}

function SearchAndFilter({ children }: ISearchAndFilter) {
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<DateTime | undefined>();
  const [endTime, setEndTime] = useState<DateTime | undefined>();



  return (
    <SearchContext.Provider
      value={{
        sessionIds,
        startTime,
        endTime
      }}
    >
      <Card>
        <Card.Header>
          <p>
            <b>SEARCH AND FILTERS</b>
          </p>
        </Card.Header>
      </Card>
      {children}
    </SearchContext.Provider>
  )
}

export { useSearch };
export default SearchAndFilter;
