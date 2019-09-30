import { LitElement, html, css, customElement, property, CSSResult, TemplateResult } from 'lit-element';
import RadioPlayerConfig from './models/radio-player-config';
import { AudioElement, AudioSource } from '@internetarchive/audio-element';
import { WaveformProgress, ZoneOfSilence } from '@internetarchive/waveform-progress';
import { PlaybackControls } from '@internetarchive/playback-controls';
import '@internetarchive/scrubber-bar';

@customElement('radio-player')
export class RadioPlayer extends LitElement {
  @property({ type: RadioPlayerConfig }) config: RadioPlayerConfig | undefined = undefined;
  // @property({ type: TranscriptConfig }) transcriptConfig: TranscriptConfig | undefined = undefined;
  // @property({ type: TranscriptEntryConfig }) currentTranscriptEntry = undefined;
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
      ${this.transcriptControllerTemplate}
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
        .waveformUrl=${this.waveformUrl}
        .percentComplete=${this.percentComplete}>
      </waveform-progress>
    `;
  }

  get waveformUrl(): string {
    return this.config ? this.config.waveformUrl : '';
  }

  get audioElementTemplate() {
    return html`
      <audio-element
        id="audioPlayer"
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
        .percentComplete=${this.percentComplete}
        @valuechange=${this.scrubberBarValueChanged}>
      </scrubber-bar>
    `;
  }

  get transcriptControllerTemplate(): TemplateResult {
    return html``;
  //   return html`
  //     <transcript-view
  //       .config=${this.transcriptConfig}
  //       .currentTime=${this.currentTime}
  //       @transcriptEntryChanged=${this.transcriptEntryChanged}>
  //     </transcript-controller>
  // `;
  }

  get transcriptViewTemplate(): TemplateResult {
    return html``;
    // return html`
    //   <transcript-view
    //     .entries=${this.transcriptEntries}
    //     .currentEntry=${this.currentTranscriptEntry}
    //     @transcriptEntrySelected=${this.transcriptEntrySelected}>
    //   </transcript-view>
    // `;
  }

  // get transcriptEntries() {
  //   return this.transcriptConfig ? this.transcriptConfig.entries : [];
  // }

  get audioPlayer(): AudioElement | null {
    return this.shadowRoot ? this.shadowRoot.getElementById('audioPlayer') as AudioElement : null;
  }

  changePlaybackRate(e: Event): void {
    const target = e.target as HTMLFormElement;
    this.playbackRate = target.value;
  }

  backButtonHandler(): void {
    this.audioPlayer && this.audioPlayer.seekBy(-10);
  }

  playPauseButtonHandler(): void {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.audioPlayer && this.audioPlayer.play();
    } else {
      this.audioPlayer && this.audioPlayer.pause();
    }
  }

  forwardButtonHandler(): void {
    this.audioPlayer && this.audioPlayer.seekBy(10);
  }

  handleDurationChange(e: CustomEvent): void {
    this.duration = e.detail.duration;
  }

  handleTimeChange(e: CustomEvent): void {
    this.currentTime = e.detail.currentTime;
    const percent = this.currentTime / this.duration
    this.percentComplete = percent * 100;
  }

  scrubberBarValueChanged(e: CustomEvent): void {
    const percentage = e.detail.value;
    const newTime = this.duration * (percentage / 100);
    this.audioPlayer && this.audioPlayer.seekTo(newTime);
  }

  // transcriptEntryChanged(e: CustomEvent): void {
  //   this.currentTranscriptEntry = e.detail.entry;
  // }

  transcriptEntrySelected(e: CustomEvent): void {
    const newTime = e.detail.entry.startTime;
    this.audioPlayer && this.audioPlayer.seekTo(newTime);
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
