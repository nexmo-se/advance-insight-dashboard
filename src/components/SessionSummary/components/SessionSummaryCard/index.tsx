import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Box } from "@material-ui/core";
import { get } from 'lodash';

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
  console.log("[SessionSummaryQuery]", sessionIds);
  console.log("data", data);
  console.log("error", error);
  if (loading) {
    return <p>Loading ...</p>;
  }
  const resources = get(data, 'project.sessionData.sessions.resources', []);
  console.log("resources", resources)
  if (resources && resources.length) {
    return (
        <>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <div>{sessionIds[0]}</div>
            {/* <div>{resources[0]}</div> */}
          </Box>
        </>
      );
  }
  return <p>There are not meetings for this session</p>;
}
