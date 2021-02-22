import { DateTime } from "luxon";

export type MeetingResponse = {
  createdAt: string;
  connections: {
    maxConcurrent: number;
  },
  publishers: {
    maxConcurrent: number;
  }
}

export type SessionResponse = {
  sessionId: string;
  publisherMinutes?: number;
  subscriberMinutes?: number;
  meetings?: {
    resources: MeetingResponse[]
  }
}

export type ListResponse = {
  data: {
    project: {
      sessionData: {
        sessionSummaries: {
          resources: SessionResponse[]
        }
      }
    }
  }
}

export type RetrieveResponse = {
  data: {
    project: {
      sessionData : {
        sessions: {
          resources: SessionResponse[]
        }
      }
    }
  }
}

export interface ListSessionIdsOptions {
  apiKey: string;
  jwt: string;
  startTime: DateTime;
  endTime: DateTime;
}

export interface RetrieveDetailOptions {
  id: string;
  apiKey: string;
  jwt: string;
}