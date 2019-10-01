import { LitElement, html, css, customElement, property, CSSResult, TemplateResult } from 'lit-element';
import RadioPlayerConfig from './models/radio-player-config';
import { AudioElement, AudioSource } from '@internetarchive/audio-element';
import { TranscriptConfig, TranscriptEntryConfig } from '@internetarchive/transcript-view';
import '@internetarchive/waveform-progress';
import '@internetarchive/playback-controls';
import '@internetarchive/scrubber-bar';

@customElement('radio-player')
export class RadioPlayer extends LitElement {
  @property({ type: RadioPlayerConfig }) config: RadioPlayerConfig | undefined = undefined;
  @property({ type: TranscriptConfig }) transcriptConfig: TranscriptConfig | undefined = undefined;
  @property({ type: Number }) percentComplete = 0;
  @property({ type: Boolean }) isPlaying = false;
  @property({ type: Number }) currentTime = 0;
  @property({ type: Number }) duration = 0;
  @property({ type: String }) collectionImgUrl = '';
  @property({ type: Number }) playbackRate = 1;

  render(): TemplateResult {
    return html`
      ${this.audioElementTemplate}
      <div class="row">
        ${this.collectionImageTemplate}
        ${this.playbackControlsTemplate}
        <div class="waveform-scrubber-container">
          ${this.waveFormProgressTemplate}
          ${this.scrubberBarTemplate}
        </div>
      </div>
      ${this.transcriptViewTemplate}
    `;
  }

  get collectionImageTemplate() {
    return html`
      <img class="collection-image" src=${this.logoUrl} />
    `;
  }

  get logoUrl(): string {
    return this.config ? this.config.logoUrl : '';
  }

  get waveFormProgressTemplate() {
    return html`
      <waveform-progress
        interactive=true
        .waveformUrl=${this.waveformUrl}
        .percentComplete=${this.percentComplete}
        @valuechange=${this.valueChangedFromScrub}>
      </waveform-progress>
    `;
  }

  get waveformUrl(): string {
    return this.config ? this.config.waveformUrl : '';
  }

  get audioElementTemplate() {
    return html`
      <audio-element
        .sources=${this.audioSources}
        .playbackRate=${this.playbackRate}
        @timeupdate=${this.handleTimeChange}
        @durationchange=${this.handleDurationChange}>
      </audio-element>
    `;
  }

  get audioSources(): AudioSource[] {
    return this.config ? this.config.audioSources : [];
  }

  get playbackControlsTemplate() {
    return html`
      <playback-controls
        @back-button-pressed=${this.backButtonHandler}
        @play-pause-button-pressed=${this.playPauseButtonHandler}
        @forward-button-pressed=${this.forwardButtonHandler}>
      </playback-controls>
    `;
  }

  get scrubberBarTemplate() {
    return html`
      <scrubber-bar
        .value=${this.percentComplete}
        @valuechange=${this.valueChangedFromScrub}>
      </scrubber-bar>
    `;
  }

  get transcriptViewTemplate(): TemplateResult {
    return html`
      <transcript-view
        .config=${this.transcriptConfig}
        .currentTime=${this.currentTime}
        @transcriptEntrySelected=${this.transcriptEntrySelected}>
      </transcript-view>
    `;
  }

  get transcriptEntries(): TranscriptEntryConfig[] {
    return this.transcriptConfig ? this.transcriptConfig.entries : [];
  }

  get audioElement(): AudioElement | null {
    return this.shadowRoot ? this.shadowRoot.querySelector('audio-element') as AudioElement : null;
  }

  changePlaybackRate(e: Event): void {
    const target = e.target as HTMLFormElement;
    this.playbackRate = target.value;
  }

  backButtonHandler(): void {
    this.audioElement && this.audioElement.seekBy(-10);
  }

  playPauseButtonHandler(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.audioElement && this.audioElement.play();
    } else {
      this.audioElement && this.audioElement.pause();
    }
  }

  forwardButtonHandler(): void {
    this.audioElement && this.audioElement.seekBy(10);
  }

  handleDurationChange(e: CustomEvent): void {
    this.duration = e.detail.duration;
  }

  handleTimeChange(e: CustomEvent): void {
    this.currentTime = e.detail.currentTime;
    const percent = this.currentTime / this.duration
    this.percentComplete = percent * 100;
  }

  valueChangedFromScrub(e: CustomEvent): void {
    const percentage = e.detail.value;
    const newTime = this.duration * (percentage / 100);
    this.audioElement && this.audioElement.seekTo(newTime);
    this.percentComplete = percentage;
  }

  transcriptEntrySelected(e: CustomEvent): void {
    const newTime = e.detail.entry.startTime;
    this.audioElement && this.audioElement.seekTo(newTime);
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
      }

      .container {
        display: block;
        position: relative;
        background-color: white;
        width: 100%;
        height: 100%;
      }

      waveform-progress {
        width: 100%;
        height: 5rem;
      }

      .fill {
        position: absolute;
        height: 100%;
        background-color: lightblue;
      }

      .row {
        display: flex;
        align-items: center;
      }

      .collection-image {
        object-fit: contain;
      }

      .waveform-scrubber-container {
        width: 100%;
        height: 100%;
      }
    `;
  }
}
