import { AudioSource } from '@internetarchive/audio-element';

export default class RadioPlayerConfig {
  title: string;
  startTime: string;
  logoUrl: string;
  waveformUrl: string;
  audioSources: AudioSource[];

  constructor(
    title: string,
    startTime: string,
    logoUrl: string,
    waveformUrl: string,
    audioSources: AudioSource[]
  ) {
    this.title = title;
    this.startTime = startTime;
    this.logoUrl = logoUrl;
    this.waveformUrl = waveformUrl;
    this.audioSources = audioSources;
  }
}
