import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useSession } from "./../../components/SessionProvider";

const getSessionSummaryData = gql`
{
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: ["1_MX40Njg0MzE4NH5-MTYxMTY3Nzc4ODA2NH51MWFqWU5kUzJBMURoK2pNY29ac21hMGZ-fg"]){
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
    const { loading, error, data } = useQuery(getSessionSummaryData, {
        variables: { projectId: apiKey, sessionId: testSessionId },
      });
      if (loading) return <p>Loading ...</p>;
      return <h1>Hello {data}!</h1>;
}

export default SessionSummary