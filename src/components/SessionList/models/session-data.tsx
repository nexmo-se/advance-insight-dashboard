import { DateTime } from "luxon";

interface Constructor {
  id: string;
  createdAt: DateTime;
  connections: number;
  maxPublishers: number;
  publishedMinutes: number;
  subscribedMinutes: number;
  quality: number;
}

class SessionData {
  id: string;
  createdAt: DateTime;
  connections: number;
  maxPublishers: number;
  publishedMinutes: number;
  subscribedMinutes: number;
  quality: number;

  constructor(args: Constructor) {
    this.id = args.id;
    this.createdAt = args.createdAt;
    this.connections = args.connections;
    this.maxPublishers = args.maxPublishers;
    this.publishedMinutes = Math.round(args.publishedMinutes);
    this.subscribedMinutes = Math.round(args.subscribedMinutes);
    this.quality = args.quality;
  }

}

export default SessionData;
