
import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";
import {SessionSummaryQuery} from './components/SessionSummaryCard'


function SessionSummary() {
  const { apiKey } = useSession();
  const { sessionIds } = useSearch();
  if (apiKey && sessionIds && sessionIds.length) {
    return <SessionSummaryQuery apiKey={apiKey} sessionIds={sessionIds} />
  } else {
    return <h1>No session selected</h1>;
  }
}

export default SessionSummary;
