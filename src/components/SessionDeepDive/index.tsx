import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";
import UsageTimeline from "./components/UsageTimeline";

import Card from "components/Card";


import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";

// Assumptions: this component handles one session at a time.

function SessionDeepDive() {
  const { apiKey } = useSession();
  // const { sessionIds, startTime, endTime, meetingId } = useSearch();
  const { sessionIds, startTime, endTime, meetingId } = useSearch();
  if (apiKey && sessionIds && sessionIds.length) {
    return (
        <Card>
          <Card.Content>
            {/* Put your components here */ }
            <Accordion expanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <p>Usage Timeline</p>
              </AccordionSummary>
              <AccordionDetails>
                {meetingId ? <UsageTimeline
                  apiKey={apiKey}
                  sessionIds={sessionIds}
                  startTime={startTime}
                  endTime={endTime}
                  meetingId={meetingId} 
                ></UsageTimeline> : <p><b>Please select a meeting to display the graph</b></p>} 
              </AccordionDetails>
            </Accordion>
          </Card.Content>
        </Card>
      );
  }
  return null;
  
}

export default SessionDeepDive;
