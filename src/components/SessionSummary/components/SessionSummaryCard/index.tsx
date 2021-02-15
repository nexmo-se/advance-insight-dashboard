import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Box, Typography } from "@material-ui/core";
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
  console.log("[SessionSummaryQuery]", sessionIds);
  console.log("data", data);
  console.log("error", error);
  if (loading) {
    return <p>Loading ...</p>;
  }
  const resources = get(data, "project.sessionData.sessions.resources", []);

  console.log("resources", resources);
  if (resources && resources[0].meetings) {
    let meetings = get(resources[0], "meetings.resources", []);
    console.log("meetings", meetings);
    let totalConnections = 0;
    let totalPublishers = 0;
    let totalSubscribers = 0;
    for (let meeting of meetings) {
        console.log("m", meeting)
        totalConnections += meeting.connections.totalCount;
        totalPublishers += meeting.publishers.totalCount;
        totalSubscribers += meeting.subscribers.totalCount;
    }
    return (
      <>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <div>{sessionIds[0]}</div>
          <div>
            <Typography variant="h5" component="span">Session Created: </Typography>
            <Typography component="span" variant="body1">{meetings[0].createdAt}</Typography>
          </div>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* Session Summary */}
          <Box display="flex" p={1}>
            <Box display="flex" flexDirection="column" m={3}>
                <Typography variant="h3" component="span">Total Minutes</Typography>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Box display="flex">
                        <Typography className={classes.totalMinutesStyle}>{Math.round(resources[0].publisherMinutes + resources[0].subscriberMinutes)}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="center" p={1}>
                        <Box display="flex">
                            <Typography component="span" className={classes.pubSubMinutesTitleStyle}>Publisher Min: </Typography>     
                            <Typography component="span" className={classes.pubSubMinutesStyle}>{Math.round(resources[0].publisherMinutes)}</Typography> 
                        </Box>
                        <Box display="flex" >
                            <Typography component="span" className={classes.pubSubMinutesTitleStyle}>Subscriber Min: </Typography>     
                            <Typography component="span" className={classes.pubSubMinutesStyle}>{Math.round(resources[0].subscriberMinutes)}</Typography> 
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box display="flex" flexDirection="column" m={3}>
                <Typography variant="h3" component="span">Total Connections</Typography>
                <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Box display="flex">
                        <Typography className={classes.totalMinutesStyle}>{totalConnections}</Typography>
                    </Box>
                    <Box display="flex" flexDirection="column" justifyContent="center" p={1}>
                        <Box display="flex">
                            <Typography component="span" className={classes.pubSubMinutesTitleStyle}>Publishers: </Typography>     
                            <Typography component="span" className={classes.pubSubMinutesStyle}>{totalPublishers}</Typography> 
                        </Box>
                        <Box display="flex" >
                            <Typography component="span" className={classes.pubSubMinutesTitleStyle}>Subscribers: </Typography>     
                            <Typography component="span" className={classes.pubSubMinutesStyle}>{totalSubscribers}</Typography> 
                        </Box>
                    </Box>
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
