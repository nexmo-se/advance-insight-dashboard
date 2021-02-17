import lodash from "lodash";
import SessionData from "../models/session-data";
import { DateTime } from "luxon";

import { ListResponse, ListSessionIdsOptions, RetrieveDetailOptions, RetrieveResponse, SessionResponse } from "types/SessionList";

class SessionService {
  static async listSessionIds({ apiKey, jwt, startTime, endTime }: ListSessionIdsOptions): Promise<string[]> {
    const payload = `
      {
        project(projectId: ${apiKey}) {
          sessionData {
            sessionSummaries(start: ${startTime.toMillis()}, end: ${endTime.toMillis()}, first: 10) {
              totalCount
              pageInfo {
                endCursor
                hasNextPage
              }
              resources {
                sessionId
              }
            }
          }
        }
      }      
    `;

    const response = await fetch("https://insights.opentok.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-OPENTOK-AUTH": jwt
      },
      body: JSON.stringify({ query: payload })
    });

    if (response.ok && response.headers.get("Content-Type")?.includes("application/json")) {
      const json: ListResponse = await response.json();
      const sessionIds = json.data.project.sessionData.sessionSummaries.resources.map((session: SessionResponse) => session.sessionId);
      return sessionIds;
    } else return [];
  }

  static async retrieveDetail({ id, apiKey, jwt }: RetrieveDetailOptions): Promise<SessionData | undefined> {
    const payload = `
      {
        project(projectId: ${apiKey}) {
          sessionData {
            sessions(sessionIds: ["${id}"]) {
              resources{
                sessionId
                publisherMinutes
                subscriberMinutes
                meetings {
                  resources {
                    createdAt
                    connections {
                      maxConcurrent
                    }
                    publishers {
                      maxConcurrent
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch("https://insights.opentok.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-OPENTOK-AUTH": jwt
      },
      body: JSON.stringify({ query: payload })
    });

    if (response.ok && response.headers.get("Content-Type")?.includes("application/json")) {
      const json: RetrieveResponse = await response.json();
      const [ data ] = json.data.project.sessionData.sessions.resources.map((session) => {
        console.log(session.subscriberMinutes, session.sessionId);
        if (!session.meetings) return undefined;
        if (session.publisherMinutes === undefined) return undefined;
        if (session.subscriberMinutes === undefined) return undefined;
        const [ meeting ] = session.meetings.resources;

        const createdAt = DateTime.fromISO(meeting.createdAt);
        const connections = session.meetings.resources.map((meeting) => meeting.connections.maxConcurrent);
        const maxPublishers = session.meetings.resources.map((meeting) => meeting.publishers.maxConcurrent);

        return new SessionData({
          id: session.sessionId,
          publishedMinutes: session.publisherMinutes,
          subscribedMinutes: session.subscriberMinutes,
          connections: lodash.max(connections) ?? 0,
          maxPublishers: lodash.max(maxPublishers) ?? 0,
          quality: 0,
          createdAt,
        })
      })

      return data;
    } else return undefined;
  }
}

export default SessionService;
