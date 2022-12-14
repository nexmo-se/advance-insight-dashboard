import { DateTime } from "luxon";
import { get } from "lodash";

import { useQuery, gql } from "@apollo/client";

import { Box } from "@material-ui/core";

import MeetingDropdown from "../MeetingDropdown";
import SessionTotalData from "../SessionTotalData";
import { useSearch } from "components/SearchAndFilter";

// query getSessionSummaryData($projectId: String!, $sessionId: String! )

const GET_SESSION_SUMMARY_DATA = gql`
  query GetSessionSummaryData($projectId: IntOrString!, $sessionId: [String]!, $startTime: Date!, $endTime: Date!) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: $sessionId) {
          resources {
            publisherMinutes
            subscriberMinutes
            meetings (start: $startTime, end: $endTime){
              totalCount
              resources {
                meetingId
                createdAt
                destroyedAt
                publisherMinutes
                subscriberMinutes
                connections {
                  totalCount
                }
                publishers {
                  totalCount
                }
                subscribers {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;


interface SessionSummaryQueryProps {
  apiKey: string;
  sessionIds: string[];
  startTime: DateTime;
  endTime: DateTime;
  meetingId?: string;
}

export function SessionSummaryQuery({ apiKey, sessionIds, startTime,
    endTime}: SessionSummaryQueryProps) {
  let queryToUse = GET_SESSION_SUMMARY_DATA;
  const { meetingId } = useSearch();
  const { loading, data, error } = useQuery(queryToUse, {
    variables: { projectId: apiKey, sessionId: sessionIds, startTime, endTime },
  });

  if (loading) {
    return (<div>
    <div className="Vlt-spinner"></div>
    <p>Loading ...</p>
    </div>);
  }
  if (error) return <p>There was an error retrieving the data</p>

  const resources = get(data, "project.sessionData.sessions.resources", []);
  
  if (resources && resources.length && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    let dropdownMeetings = meetings.slice();
    if (!meetings.length) {
        return <p>There are not meetings for this session</p>;
    }
    // todo it could happen that meetings has 0 entry - need to change the createdAt
    return (
      <>
        {/** HEADER SECTION */}
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box>
            <b>ADVANCED INSIGHTS SUMMARY</b>
            <br />
            {sessionIds[0]}
            <br />
            <Box
              display="flex"
              alignItems="flex-start"
            >
              <Box mr={2}>
                <p>
                  <strong>Meeting Created: &nbsp;</strong>
                  {
                    DateTime.fromISO(meetings[0].createdAt).toLocaleString(DateTime.TIME_24_SIMPLE)
                    
                  }
                </p>
              </Box>
              <p>
                <strong>Meeting Destroyed: &nbsp;</strong>
                {
                  DateTime.fromISO(meetings[0].destroyedAt).toLocaleString(DateTime.DATETIME_MED)
                  
                }
              </p>
            </Box>
          </Box>
          <Box display="flex">
            <Box mr={2}>
              <MeetingDropdown meetings={dropdownMeetings} />
            </Box>

            <button onClick={()=> window.open(`https://tokbox.com/developer/tools/inspector/account/admin/project/46423292/session/${sessionIds[0]}`, "_blank")}
            className="Vlt-btn Vlt-btn--primary Vlt-btn--app Vlt-btn--outline">
              View Inspector
            </button>
          </Box>
        </Box>
        <SessionTotalData apiKey={apiKey} sessionIds={sessionIds} 
              startTime={startTime} endTime={endTime} meetingId={meetingId}></SessionTotalData>        
      </>
    );
  }
  return <p>There are not meetings for this session</p>;
}
