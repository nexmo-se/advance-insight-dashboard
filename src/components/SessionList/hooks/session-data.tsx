import SessionData from "../models/session-data";
import lodash from "lodash";
import { DateTime } from "luxon";
import { gql } from "@apollo/client";

import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useSession } from "components/SessionProvider";
import { useSearch } from "components/SearchAndFilter";


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

interface ListSessionSummaryOptions {
  projectId: string;
  startTime: number;
  endTime: number;
  endCursor?: string;
}

export function useSessionData () {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const { apiKey } = useSession();
  const { startTime, endTime } = useSearch();
  const [fetchData, { loading, error, data, refetch }] = useLazyQuery<any, ListSessionSummaryOptions>(LIST_SESSION_SUMMARY, {
    variables: {
      projectId: apiKey,
      startTime: startTime.toMillis(),
      endTime: endTime.toMillis()
    }
  });

  function loadMore () {
    if (!refetch) return;
    if (!endCursor) return;
    
    // Since pagination is a bit hard to do
    // I will use refetch() function with endCursor
    refetch({
      projectId: apiKey,
      startTime: startTime.toMillis(),
      endTime: endTime.toMillis(),
      endCursor
    })
  }

  useEffect(
    () => {
      if (!data) return;

      const endCursor = lodash.get(data, "project.sessionData.sessionSummaries.pageInfo.endCursor");
      setEndCursor(endCursor);

      const sessionSummaries = lodash.get(data, "project.sessionData.sessionSummaries.resources");
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
      setSessions(
        (oldData) => {
          // Just in case I have duplicate data, remove duplicate data
          // before passing it to sessions
          const combinedData = [...oldData, ...sessions];
          return lodash.uniqBy(combinedData, "id");
        }
      );
    },
    [data]
  );

  useEffect(
    () => {
      if (!apiKey) return;
      if (!startTime) return;
      if (!endTime) return;

      fetchData();
    },
    [apiKey, startTime, endTime, fetchData]
  );

  return {
    hasNext: !!endCursor,
    loading,
    error,
    sessions,
    loadMore
  }
}

