import SessionData from "../models/session-data";
import lodash from "lodash";
import { DateTime } from "luxon";
import { gql } from "@apollo/client";

import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";


// Assumption: any session does not have more than 1000 meetings
// The first load will be 10 sessions
const LIST_SESSION_SUMMARY = gql`
  query ListSessionIds($projectId: Int!, $startTime: Date!, $endTime: Date!, $endCursor: String) {
    project(projectId: $projectId) {
      sessionData {
        sessionSummaries(start: $startTime, end: $endTime, endCursor: $endCursor, first: 10) {
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
          resources {
            sessionId,
            publisherMinutes,
            subscriberMinutes,
            meetings (first: 1000) {
              resources {
                createdAt
                destroyedAt
                totalConnections
              }
            }
          }
        }
      }
    }
  }
`;

interface SessionDataOptions {
  apiKey: string;
  startTime: DateTime;
  endTime: DateTime;
}

interface ListSessionSummaryOptions {
  projectId: string;
  startTime: number;
  endTime: number;
  endCursor?: string;
}

export function useSessionData ({ apiKey, startTime, endTime }: SessionDataOptions) {
  console.log(startTime, endTime);

  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const { loading, error, data, fetchMore } = useQuery<any, ListSessionSummaryOptions>(LIST_SESSION_SUMMARY, {
    variables: {
      projectId: apiKey,
      startTime: startTime.toMillis(),
      endTime: endTime.toMillis()
    }
  });

  useEffect(
    () => {
      if (data) {
        setEndCursor(data.project.sessionData.sessionSummaries.pageInfo.endCursor);

        const { resources: sessionSummaries } = data.project.sessionData.sessionSummaries;
        const sessions = sessionSummaries.map(
          (sessionSummary: any) => {
            const createdAt = lodash.min<number>(
              sessionSummary.meetings.resources.map(
                (meeting: any) => {
                  return DateTime.fromISO(meeting.createdAt).toMillis()
                }
              )
            );

            const destroyedAt = lodash.max<number>(
              sessionSummary.meetings.resources.map(
                (meeting: any) => {
                  return DateTime.fromISO(meeting.destroyedAt).toMillis()
                }
              )
            )

            const connections = sessionSummary.meetings.resources.map(
              (meeting: any) => {
                return meeting.totalConnections;
              }
            );

            return new SessionData({
              id: sessionSummary.sessionId,
              createdAt: createdAt? DateTime.fromMillis(createdAt): undefined,
              destroyedAt: destroyedAt? DateTime.fromMillis(destroyedAt): undefined,
              connections: lodash.max(connections) ?? 0,
              publishedMinutes: sessionSummary.publisherMinutes,
              subscribedMinutes: sessionSummary.subscriberMinutes,
              quality: 0
            })
          }
        );
        setSessions(sessions);
      }
    },
    [data]
  );

  return {
    loading,
    error,
    sessions,
    endCursor,
    fetchMore
  }
}

