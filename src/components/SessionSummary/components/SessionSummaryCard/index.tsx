import React from "react";
import { useQuery, gql } from "@apollo/client";
import {
  Box,
  Table,
  TableCell,
  TableContainer,
  Typography,
  TableRow,
  TableHead,
  TableBody,
} from "@material-ui/core";
import { DataGrid, ColDef } from "@material-ui/data-grid";
import { get } from "lodash";
import useStyles from "./styles";

// query getSessionSummaryData($projectId: String!, $sessionId: String! )

const GET_SESSION_SUMMARY_DATA = gql`
  query GetSessionSummaryData($projectId: Int!, $sessionId: [String]!) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: $sessionId) {
          resources {
            publisherMinutes
            subscriberMinutes
            meetings {
              totalCount
              resources {
                createdAt
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
}: {
  apiKey: string;
  sessionIds: string[];
}) {
  const { loading, error, data } = useQuery(GET_SESSION_SUMMARY_DATA, {
    variables: { projectId: apiKey, sessionId: sessionIds },
  });
  const classes = useStyles();
  if (loading) {
    return <p>Loading ...</p>;
  }
  const resources = get(data, "project.sessionData.sessions.resources", []);
  if (resources && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    let totalConnections = 0;
    let totalPublishers = 0;
    let totalSubscribers = 0;
    let meetingsData = [];
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>{sessionIds[0]}</div>
          <div>
            <Typography variant="h5" component="span">
              Session Created:{" "}
            </Typography>
            <Typography component="span" variant="body1">
              {meetings[0].createdAt}
            </Typography>
          </div>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* Session Summary */}
          <Box display="flex" p={1} flexDirection="column">
            <Box display="flex" flexDirection="row">
              <Box display="flex" flexDirection="column" m={3}>
                <Typography variant="h3" component="span">
                  Total Minutes
                </Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex">
                    <Typography className={classes.totalMinutesStyle}>
                      {Math.round(
                        resources[0].publisherMinutes +
                          resources[0].subscriberMinutes
                      )}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    p={1}
                  >
                    <Box display="flex">
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesTitleStyle}
                      >
                        Publisher Min:{" "}
                      </Typography>
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesStyle}
                      >
                        {Math.round(resources[0].publisherMinutes)}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesTitleStyle}
                      >
                        Subscriber Min:{" "}
                      </Typography>
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesStyle}
                      >
                        {Math.round(resources[0].subscriberMinutes)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box display="flex" flexDirection="column" m={3}>
                <Typography variant="h3" component="span">
                  Total Connections
                </Typography>
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box display="flex">
                    <Typography className={classes.totalMinutesStyle}>
                      {totalConnections}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    p={1}
                  >
                    <Box display="flex">
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesTitleStyle}
                      >
                        Publishers:{" "}
                      </Typography>
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesStyle}
                      >
                        {totalPublishers}
                      </Typography>
                    </Box>
                    <Box display="flex">
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesTitleStyle}
                      >
                        Subscribers:{" "}
                      </Typography>
                      <Typography
                        component="span"
                        className={classes.pubSubMinutesStyle}
                      >
                        {totalSubscribers}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column">
              <Box m={2}>
                <Typography variant="h5">Usage Breakdown</Typography>
              </Box>
              <Box display="flex" style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={meetingsData}
                  columns={usageBreakdownColumn}
                  pageSize={5}
                  showToolbar={true}
                />
              </Box>
            </Box>
          </Box>
          {/* Session Quality */}
          <Box display="flex" flexDirection="column">
            <h3>Quality</h3>
          </Box>
        </Box>
      </>
    );
  }
  return <p>There are not meetings for this session</p>;
}
