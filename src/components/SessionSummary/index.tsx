import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";
import { SessionSummaryQuery } from "./components/SessionSummaryCard";
import Card from "components/Card";
import Button from "components/Button";

import { Box } from "@material-ui/core";

// Assumptions: this component handles one session at a time.

function SessionSummary() {
  const { apiKey } = useSession();
  const { sessionIds } = useSearch();
  console.log("sessionIds", sessionIds)
  return (
    <Card>
      <Card.Header>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <p>
            <b>ADVANCED INSIGHTS SUMMARY</b>
          </p>
        </Box>
      </Card.Header>
      <Card.Content>
          <span>
            {(apiKey && sessionIds && sessionIds.length)
              ? <SessionSummaryQuery apiKey={apiKey} sessionIds={sessionIds} />
              : "No session Selected"}
          </span>
      </Card.Content>
    </Card>
  );

}

export default SessionSummary;
