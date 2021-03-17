import {
  Quality as BaseQuality,
  QualityValue
} from "../types";

class Quality implements BaseQuality {
  mos?: QualityValue;
  bitrate: QualityValue;
  latency: QualityValue;
  packetLoss: QualityValue;
  
  constructor (args: Quality) {
    this.mos = args.mos ?? {
      avg: 0,
      min: 0,
      max: 0
    };
    
    this.bitrate = args.bitrate;
    this.latency = args.latency;
    this.packetLoss = args.packetLoss;
  }
}

export default Quality;
