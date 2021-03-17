export interface QualityValue {
  avg: number;
  max: number;
  min: number;
}

export interface Quality {
  mos?: QualityValue;
  bitrate: QualityValue;
  latency: QualityValue;
  packetLoss: QualityValue;
}

export interface AudioVideoQuality {
  audio: Quality;
  video: Quality;
}

export interface StreamValue {
  subscribe: boolean,
  latency: number,
  bitrate: number,
  packetLoss: number
}

export interface Resolution {
  width: number;
  height: number;
}

export interface AudioStreamValue extends StreamValue {};
export interface VideoStreamValue extends StreamValue {
  resolution: Resolution;
}