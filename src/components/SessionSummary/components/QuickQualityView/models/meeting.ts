import Subscriber from "./subscriber";
import lodash from "lodash";
import { DateTime } from "luxon";

interface Constructor {
  id: string;
  createdAt: DateTime;
  destroyedAt: DateTime;
  subscribers: Subscriber[];
}

class Meeting {
  id: string;
  createdAt: DateTime;
  destroyedAt: DateTime;
  subscribers: Subscriber[];

  constructor (args: Constructor) {
    this.id = args.id;
    this.createdAt = args.createdAt;
    this.destroyedAt = args.destroyedAt;
    this.subscribers = args.subscribers;
  }

  static fromResponse (data: Record<string, any>) {
    const rawSubscribers = lodash.get(data, "subscribers.resources");

    return new Meeting({
      id: data.meetingId,
      createdAt: DateTime.fromISO(data.createdAt),
      destroyedAt: DateTime.fromISO(data.destroyedAt),
      subscribers: rawSubscribers.map(
        (rawSubscriber: Record<string, any>) => Subscriber.fromResponse(rawSubscriber)
      )
    })
  }
}

export default Meeting;
