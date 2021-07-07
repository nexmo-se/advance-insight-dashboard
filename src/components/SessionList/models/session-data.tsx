import { DateTime } from "luxon";

interface Constructor {
  id: string;
  createdAt?: DateTime;
  destroyedAt?: DateTime;
  connections: number;
  publishedMinutes: number;
  subscribedMinutes: number;
  quality: number;
}

class SessionData {
  id: string;
  createdAt?: DateTime;
  destroyedAt?: DateTime;
  connections: number;
  publishedMinutes: number;
  subscribedMinutes: number;
  quality: number;

  constructor(args: Constructor) {
    this.id = args.id;
    this.createdAt = args.createdAt;
    this.connections = args.connections;
    this.destroyedAt = args.destroyedAt;
    this.publishedMinutes = Math.round(args.publishedMinutes);
    this.subscribedMinutes = Math.round(args.subscribedMinutes);
    this.quality = args.quality;
  }

  toCSV () {
    return {
      id: this.id,
      created_at: this.createdAt?.toLocaleString(DateTime.DATETIME_FULL),
      destroyed_at: this.destroyedAt?.toLocaleString(DateTime.DATETIME_FULL),
      total_connections: this.connections,
      published_minutes: this.publishedMinutes,
      subscribed_minutes: this.subscribedMinutes
    }
  }
}

export default SessionData;
