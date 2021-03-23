
import { DateTime } from "luxon";
import HumanizeNumber from "utils/humanize-number";
import { get } from "lodash";
import { useQuery, gql } from "@apollo/client";
import { Box, Grid } from "@material-ui/core";
import { DataGrid, GridColDef } from "@material-ui/data-grid";
import TotalData from "../TotalData";
import QuickQualityView from "../QuickQualityView";

const GET_SESSION_SUMMARY_DATA = gql`
  query GetSessionSummaryData($projectId: Int!, $sessionId: [String]!, $startTime: Date!, $endTime: Date!) {
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

const GET_SESSION_SUMMARY_DATA_BY_MEETING = gql`
  query GetSessionSummaryData($projectId: Int!, $sessionId: [String]!, $startTime: Date!, $endTime: Date!, $meetingId: String!) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: $sessionId) {
          resources {
            publisherMinutes
            subscriberMinutes
            meetings (start: $startTime, end: $endTime, meetingId: $meetingId){
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

  function createUsageBreakDownData(
    id: number,
    publishers: number,
    subscribers: number,
    minutes: number
  ) {
    return { id, group: id + 1, publishers, subscribers, minutes };
  }
  
  const usageBreakdownColumn: GridColDef[] = [
    { field: "group", headerName: "GROUP", width: 100 },
    { field: "publishers", headerName: "PUBLISHERS", width: 150 },
    { field: "subscribers", headerName: "SUBSCRIBERS", width: 150 },
    { field: "minutes", headerName: "MINUTES", width: 150 },
  ];

export default function SessionTotalData({ apiKey, sessionIds, startTime,
    endTime, meetingId}: SessionSummaryQueryProps) {

        let queryToUse = GET_SESSION_SUMMARY_DATA;
        if (meetingId) {
            queryToUse = GET_SESSION_SUMMARY_DATA_BY_MEETING
        }
        const { loading, data, error } = useQuery(queryToUse, {
            variables: { projectId: apiKey, sessionId: sessionIds, startTime, endTime, meetingId },
          });
        
          if (loading) return (<div>
            <div className="Vlt-spinner"></div>
            <p>Loading ...</p>
            </div>);
          if (error) return <p>There was an error retrieving the data</p>
        
          const resources = get(data, "project.sessionData.sessions.resources", []);
          
          if (resources && resources.length && resources[0].meetings) {
            let meetings = get(resources[0], "meetings.resources", []);
            let totalConnections = 0;
            let totalPublishers = 0;
            let totalSubscribers = 0;
            let meetingsData = [];
            if (!meetings.length) {
                return <p>There are not meetings for this session</p>;
            }
            // todo it could happen that meetings has 0 entry - need to change the createdAt
            for (let i = 0; i < meetings.length; i += 1) {
              totalConnections += meetings[i].connections.totalCount;
              totalPublishers += meetings[i].publishers.totalCount;
              totalSubscribers += meetings[i].subscribers.totalCount;
              meetingsData.push(
                createUsageBreakDownData(
                  i,
                  meetings[i].publishers.totalCount,
                  meetings[i].subscribers.totalCount,
                  Math.round(
                    meetings[i].publisherMinutes + meetings[i].subscriberMinutes
                  )
                )
              );
            }
        
        return (
            <>
            <Grid spacing={2} container>
          <Grid xs={6} item>
          {/* Session Summary */}
            <Box
              display="flex"
              mt={2}
              flexDirection="column"
            >
              <Grid spacing={2} container>
                <Grid xs={7} item>
                  <TotalData
                    type="minutes"
                    total={
                      HumanizeNumber.humanize({
                        number: Math.round(
                          resources[0].publisherMinutes +
                          resources[0].subscriberMinutes
                        )
                      })
                    }
                    breakdown={[
                      {
                        title: "Publisher Min: ",
                        value: HumanizeNumber.humanize({
                          number: Math.round(resources[0].publisherMinutes)
                        })
                      },
                      {
                        title: "Subscriber Min: ",
                        value: HumanizeNumber.humanize({
                          number: Math.round(resources[0].subscriberMinutes)
                        })
                      }
                    ]}
                  />
                </Grid>
                <Grid xs={5} item>
                  <TotalData
                    type="connections"
                    total={totalConnections}
                    breakdown={[
                      {
                        title: "Publishers: ",
                        value: totalPublishers
                      },
                      {
                        title: "Subscribers",
                        value: totalSubscribers
                      }
                    ]}
                  />
                </Grid>
              </Grid>
              <Box
                display="flex"
                flexDirection="column"
                mt={2}
              >
                <Box>
                  <p>
                    <b>Usage Breakdown</b>
                  </p>
                </Box>
                <Box display="flex" style={{ width: "100%" }}>
                  <DataGrid
                    rows={meetingsData}
                    columns={usageBreakdownColumn}
                    pageSize={3}
                    density="compact"
                    autoHeight={true}
                  />
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid xs={6} item>
            {/* Session Quality */}
            <QuickQualityView />
          </Grid>
        </Grid>
            </>
        )
    }
    return <p>There are not meetings for this session</p>;
}