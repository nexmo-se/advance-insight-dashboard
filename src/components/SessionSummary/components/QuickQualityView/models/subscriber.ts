import StreamStats from "./stream-stats";
import lodash from "lodash";
import { DateTime } from "luxon";

interface Constructor {
  id: string;
  createdAt: DateTime;
  destroyedAt: DateTime;
  streamStats: StreamStats[];
}

class Subscriber {
  id: string;
  createdAt: DateTime;
  destroyedAt: DateTime;
  streamStats: StreamStats[];

  constructor (args: Constructor) {
    this.id = args.id;
    this.createdAt = args.createdAt;
    this.destroyedAt = args.destroyedAt;
    this.streamStats = args.streamStats;
  }

  static fromResponse (data: Record<string, any>) {
    const rawStats = lodash.get(data, "streamStatsCollection.resources");

    return new Subscriber({
      id: data.subscriberId,
      createdAt: DateTime.fromISO(data.createdAt),
      destroyedAt: DateTime.fromISO(data.destroyedAt),
      streamStats: rawStats.map(
        (rawStat: Record<string, any>) => StreamStats.fromResponse(rawStat)
      )
    })
  }

}

export default Subscriber;
