import lodash from "lodash";
import { gql } from "@apollo/client";
import { AudioStreamValue, AudioVideoQuality, Resolution, VideoStreamValue } from "../types";

import StreamStats from "../models/stream-stats";
import Meeting from "../models/meeting";
import Quality from "../models/quality";

import { useSession } from "components/SessionProvider";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useSearch } from "components/SearchAndFilter";

// Assumption:
// We assume that there are no more than 1000 subscribers
// and there are no more than 10000 streamStatsCollection
const QUALITY_QUERY = gql`
  query RetrieveStreamStats ($projectId: Int!, $sessionIds: [String]!, $meetingId: String) {
    project(projectId: $projectId) {
      sessionData {
        sessions(sessionIds: $sessionIds) {
          resources {
            meetings(meetingId: $meetingId) {
              resources {
                meetingId
                createdAt
                destroyedAt
                subscribers(first: 1000) {
                  resources {
                    subscriberId
                    createdAt
                    destroyedAt
                    streamStatsCollection(first: 100000) {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      resources {
                        subscribeToAudio
                        audioLatencyMs
                        audioBitrateKbps
                        audioPacketLoss
                        subscribeToVideo
                        videoLatencyMs
                        videoBitrateKbps
                        videoPacketLoss
                        videoResolution
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface QualityQueryOptions {
  projectId: string;
  sessionIds: string[];
  meetingId?: string;
}

export function useQuality () {
  const [quality, setQuality] = useState<AudioVideoQuality>();
  const { apiKey } = useSession();
  const { sessionIds, meetingId } = useSearch();
  const { loading, error, data } = useQuery<any, QualityQueryOptions>(QUALITY_QUERY, {
    variables: {
      projectId: apiKey,
      sessionIds: sessionIds,
      meetingId: meetingId
    }
  });

  const normaliseStats = useCallback(
    (stats: StreamStats[], forStat: "audio" | "video") => {
      function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        if (value === null || value === undefined) return false;
        return true;
      }

      const normalStats: (AudioStreamValue[] | VideoStreamValue[]) = stats.map(
        (stat) => {
          if (stat[forStat].subscribe) {
            return stat[forStat];
          } else {
            return undefined;
          }
        }
      ).filter(notEmpty);

      return normalStats;
    },
    []
  );

  const audioMOS = useCallback(
    (delay: number, packetLossRatio: number) => {
      const LOCAL_DELAY = 30; // 30 msecs: typical frame duration
      const h = (x: number) => x < 0 ? 0 : 1;
      const a = 0; // ILBC: a=10
      const b = 19.8;
      const c = 29.7;
      /**
       * Calculate the transmission rating factor, R
       */
      const calculateR = () => {
        const d = delay + LOCAL_DELAY;
        const delayImpairment = 0.024 * d + 0.11 * (d - 177.3) * h(d - 177.3);
        const equipmentImpairment = a + b * Math.log(1 + (c * packetLossRatio));
        return 93.2 - delayImpairment - equipmentImpairment;
      };
    
      /**
       * Calculate the Mean Opinion Score based on R
       */
      const calculateMOS = (R: number) => {
        if (R < 0) {
          return 1;
        }
        if (R > 100) {
          return 4.5;
        }
        return 1 + (0.035 * R) + R * (R - 60) * (100 - R) * 0.000007;
      };
    
      return calculateMOS(calculateR());
    },
    []
  );

  const videoMOS = useCallback(
    (videoDimensions: Resolution, baseBitrate: number) => {
      const MIN_VIDEO_BITRATE = 30000;
      const targetBitrateForPixelCount = (pixelCount: number) => {
        // power function maps resolution to target bitrate, based on rumor config
        // values, with r^2 = 0.98. We're ignoring frame rate, assume 30.
        const y = 2.069924867 * (Math.log10(pixelCount) ** 0.6250223771);
        return 10 ** y;
      };
    
      const pixelCount = videoDimensions.width * videoDimensions.height;
      const targetBitrate = targetBitrateForPixelCount(pixelCount);
    
      if (baseBitrate < MIN_VIDEO_BITRATE) {
        return 1;
      }
    
      const bitrate = Math.min(baseBitrate, targetBitrate);
      let score =
        ((Math.log(bitrate / MIN_VIDEO_BITRATE) / Math.log(targetBitrate / MIN_VIDEO_BITRATE)) * 4) + 1;
      score = Math.min(score, 4.5);
      return score;
    },
    []
  )
  

  const generateQuality = useCallback(
    (stats: (AudioStreamValue[] | VideoStreamValue[])) => {
      
      const generateMosList = (stats: (AudioStreamValue[] | VideoStreamValue[])) => {
        return stats.map(
          (stat: (AudioStreamValue | VideoStreamValue)) => {
            if ((stat as VideoStreamValue).resolution) {
              const videoStat = stat as VideoStreamValue;
              return videoMOS(videoStat.resolution, (videoStat.bitrate * 8) * 1000);
            } else {
              return audioMOS(stat.latency, stat.packetLoss)
            }
          }
        )
      }
      
      const quality = new Quality({
        bitrate: {
          avg: lodash.meanBy(stats, "bitrate"),
          max: lodash.maxBy(stats, "bitrate")?.bitrate ?? 0,
          min: lodash.minBy(stats, "bitrate")?.bitrate ?? 0
        },
        latency: {
          avg: lodash.meanBy(stats, "latency"),
          max: lodash.maxBy(stats, "latency")?.latency ?? 0,
          min: lodash.minBy(stats, "latency")?.latency ?? 0
        },
        packetLoss: {
          avg: lodash.meanBy(stats, "packetLoss"),
          max: lodash.maxBy(stats, "packetLoss")?.packetLoss ?? 0,
          min: lodash.minBy(stats, "packetLoss")?.packetLoss ?? 0
        }
      });

      const mosList = generateMosList(stats);
      quality.mos = {
        avg: lodash.mean(mosList),
        max: lodash.max(mosList) ?? 0,
        min: lodash.min(mosList) ?? 0
      }
      return quality
    },
    [audioMOS, videoMOS]
  )


  useEffect(
    () => {
      if (!data) return;

      const rawMeetings = lodash.get(data, "project.sessionData.sessions.resources[0].meetings.resources");
      const meetings: Meeting[] = rawMeetings.map(
        (rawMeeting: Record<string, any>) => Meeting.fromResponse(rawMeeting)
      );

      const stats: StreamStats[] = lodash.flattenDeep(
        meetings.map(
          (meeting) => {
            return meeting.subscribers.map(
              (subscriber) => {
                return subscriber.streamStats;
              }
            )
          }
        )
      )
      
      const audioStats = normaliseStats(stats, "audio");
      const videoStats = normaliseStats(stats, "video");
      
      const videoQuality = generateQuality(videoStats);
      const audioQuality = generateQuality(audioStats);

      // console.log(audioStats, videoStats);
      // console.log(audioQuality, videoQuality);

      setQuality({
        video: videoQuality,
        audio: audioQuality
      })
    },
    [data, generateQuality, normaliseStats]
  )

  return {
    quality,
    loading,
    error
  }
}

