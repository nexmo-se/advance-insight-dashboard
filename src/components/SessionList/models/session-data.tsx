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

}

export default SessionData;
