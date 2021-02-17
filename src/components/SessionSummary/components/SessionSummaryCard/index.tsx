import React from "react";
import { useQuery, gql } from "@apollo/client";

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

export function SessionSummaryQuery({ apiKey, sessionIds }: {apiKey: string, sessionIds: string[]}) {
  const { loading, error, data } = useQuery(GET_SESSION_SUMMARY_DATA, {
    variables: { projectId: apiKey, sessionId: sessionIds },
  });
  console.log("[SessionSummaryQuery]", sessionIds)
  //  const { loading, error, data } = useQuery(GET_SESSION_SUMMARY_DATA);
  console.log("data", data);
  console.log("error", error);
  if (loading) return <p>Loading ...</p>;
  return <h1>Hello {JSON.stringify(data)}</h1>;
}
