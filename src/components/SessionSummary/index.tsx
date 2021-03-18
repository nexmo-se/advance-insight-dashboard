import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";
import { SessionSummaryQuery } from "./components/SessionSummaryCard";
import Card from "components/Card";

// Assumptions: this component handles one session at a time.

function SessionSummary() {
  const { apiKey } = useSession();
  const { sessionIds, startTime, endTime } = useSearch();
  return (
    <Card>
      <Card.Content>
          <span>
            {(apiKey && sessionIds && sessionIds.length)
              ? <SessionSummaryQuery apiKey={apiKey} sessionIds={sessionIds} 
              startTime={startTime} endTime={endTime}  />
              : "No session Selected"}
          </span>
      </Card.Content>
    </Card>
  );

}

export default SessionSummary;

