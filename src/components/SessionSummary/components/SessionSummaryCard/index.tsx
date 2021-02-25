import { DateTime } from "luxon";
import { get } from "lodash";

import useStyles from "./styles";
import { useQuery, gql } from "@apollo/client";

import { Box, Grid } from "@material-ui/core";
import { DataGrid, ColDef } from "@material-ui/data-grid";

import TotalData from "../TotalData";
import HumanizeNumber from "utils/humanize-number";

// query getSessionSummaryData($projectId: String!, $sessionId: String! )

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

function createUsageBreakDownData(
  id: number,
  publishers: number,
  subscribers: number,
  minutes: number
) {
  return { id, group: id + 1, publishers, subscribers, minutes };
}

const usageBreakdownColumn: ColDef[] = [
  { field: "group", headerName: "GROUP", width: 100 },
  { field: "publishers", headerName: "PUBLISHERS", width: 150 },
  { field: "subscribers", headerName: "SUBSCRIBERS", width: 150 },
  { field: "minutes", headerName: "MINUTES", width: 150 },
];

export function SessionSummaryQuery({
  apiKey,
  sessionIds,
  startTime,
  endTime
}: {
  apiKey: string;
  sessionIds: string[];
  startTime: DateTime;
  endTime: DateTime;
}) {
  const { loading, data } = useQuery(GET_SESSION_SUMMARY_DATA, {
    variables: { projectId: apiKey, sessionId: sessionIds, startTime, endTime },
  });
  const classes = useStyles();
  if (loading) {
    return <p>Loading ...</p>;
  }
  const resources = get(data, "project.sessionData.sessions.resources", []);
  if (resources && resources.length && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    let totalConnections = 0;
    let totalPublishers = 0;
    let totalSubscribers = 0;
    let meetingsData = [];
    for (let i = 0; i < meetings.length; i += 1) {
      console.log("[SessionSummaryCard] - meetings",meetings[i])
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
        <p>
          <b>ADVANCED INSIGHTS SUMMARY</b>
        </p>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <p>
            {sessionIds[0]}
          </p>
          <Box>
            <p>
              <strong>Session Created: &nbsp;</strong>
              {
                DateTime.fromISO(meetings[0].createdAt).toLocaleString(DateTime.DATETIME_MED)
              }
            </p>
            <p>
              <strong>Destroyed Created: &nbsp;</strong>
              {
                DateTime.fromISO(meetings[meetings.length - 1].destroyedAt).toLocaleString(DateTime.DATETIME_MED)
              }
            </p>
          </Box>
        </Box>

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
            <Box display="flex" flexDirection="column">
              <h3>Quality</h3>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
  return <p>There are not meetings for this session</p>;
}
