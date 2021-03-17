import { AudioStreamValue, VideoStreamValue } from "../types";

interface Constructor {
  audio: AudioStreamValue,
  video: VideoStreamValue
}

class StreamStats {
  audio: AudioStreamValue;
  video: VideoStreamValue;

  constructor (args: Constructor) {
    this.audio = args.audio;
    this.video = args.video;
  }

  static fromResponse (data: Record<string, any>) {
    return new StreamStats({
      audio: {
        subscribe: data.subscribeToAudio,
        latency: data.audioLatencyMs,
        bitrate: data.audioBitrateKbps,
        packetLoss: data.audioPacketLoss
      },
      video: {
        subscribe: data.subscribeToVideo,
        latency: data.videoLatencyMs,
        bitrate: data.videoBitrateKbps,
        packetLoss: data.videoPacketLoss,
        resolution: {
          width: parseInt(data.videoResolution.split("x")[0]),
          height: parseInt(data.videoResolution.split("x")[1])
        }
      }
    })
  }
}

export default StreamStats;
