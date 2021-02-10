import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSession } from "./../../components/SessionProvider";

// query getSessionSummaryData($projectId: String!, $sessionId: String! )

const GET_SESSION_SUMMARY_DATA = gql`
query GetSessionSummaryData($projectId: Int!, $sessionId: String!) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: [$sessionId]){
          resources{
            publisherMinutes,
            subscriberMinutes,
            meetings{
              totalCount,
              resources{
                createdAt,
                publishers {
                  totalCount
                },
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

function SessionSummary(){
    // this function should only display one sessionId at a time.
    // query for tot pubs and sub minutes
    const { apiKey } = useSession();
    let testSessionId = '1_MX40Njg0MzE4NH5-MTYxMTY3Nzc4ODA2NH51MWFqWU5kUzJBMURoK2pNY29ac21hMGZ-fg'
    const { loading, error, data } = useQuery(GET_SESSION_SUMMARY_DATA, {
        variables: { projectId: apiKey, sessionId: testSessionId },
      });
     //  const { loading, error, data } = useQuery(GET_SESSION_SUMMARY_DATA);
      console.log("data", data);
      console.log("error", error);
      if (loading) return <p>Loading ...</p>;
      return <h1>Hello {JSON.stringify(data)}</h1>;
}

export default SessionSummary