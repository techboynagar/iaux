import { AudioSource } from '@internetarchive/audio-element';

export default class RadioPlayerConfig {
  title: string;

  date: string;

  logoUrl: string;

  waveformUrl: string;

  audioSources: AudioSource[];

  constructor(
    title: string,
    date: string,
    logoUrl: string,
    waveformUrl: string,
    audioSources: AudioSource[],
  ) {
    this.title = title;
    this.date = date;
    this.logoUrl = logoUrl;
    this.waveformUrl = waveformUrl;
    this.audioSources = audioSources;
  }
}
