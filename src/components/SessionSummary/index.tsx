import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";
import { SessionSummaryQuery } from "./components/SessionSummaryCard";
import Card from "components/Card";
import Button from "components/Button";

import { Box } from "@material-ui/core";

// Assumptions: this component handles one session at a time.

function SessionSummary() {
  const { apiKey } = useSession();
  const { sessionIds, startTime, endTime, meetingId } = useSearch();
  return (
    <Card>
      <Card.Content>
          <span>
            {(apiKey && sessionIds && sessionIds.length)
              ? <SessionSummaryQuery apiKey={apiKey} sessionIds={sessionIds} 
              startTime={startTime} endTime={endTime}  meetingId={meetingId}/>
              : "No session Selected"}
          </span>
      </Card.Content>
    </Card>
  );

}

export default SessionSummary;

