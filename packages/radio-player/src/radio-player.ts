import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';
import { AudioElement, AudioSource } from '@internetarchive/audio-element';
import { TranscriptConfig, TranscriptEntryConfig } from '@internetarchive/transcript-view';
import RadioPlayerConfig from './models/radio-player-config';
import '@internetarchive/waveform-progress';
import '@internetarchive/playback-controls';
import '@internetarchive/scrubber-bar';

@customElement('radio-player')
export default class RadioPlayer extends LitElement {
  @property({ type: RadioPlayerConfig }) config: RadioPlayerConfig | undefined = undefined;

  @property({ type: TranscriptConfig }) transcriptConfig: TranscriptConfig | undefined = undefined;

  @property({ type: Number }) percentComplete = 0;

  @property({ type: Boolean }) isPlaying = false;

  @property({ type: Number }) currentTime = 0;

  @property({ type: Number }) duration = 0;

  @property({ type: String }) collectionImgUrl = '';

  @property({ type: Number }) playbackRate = 1;

  @property({ type: String }) searchTerm = '';

  render(): TemplateResult {
    return html`
      ${this.audioElementTemplate}
      <main>
        ${this.titleDateTemplate} ${this.collectionLogoTemplate} ${this.playbackControlsTemplate}
        <div class="waveform-scrubber-container">
          ${this.waveFormProgressTemplate} ${this.scrubberBarTemplate}
        </div>
        ${this.searchSectionTemplate} ${this.transcriptViewTemplate}
      </main>
    `;
  }

  get titleDateTemplate(): TemplateResult {
    return html`
      <div class="title-date">
        <div class="title">
          ${this.config ? this.config.title : ''}
        </div>

        <div class="date">
          ${this.config ? this.config.date : ''}
        </div>
      </div>
    `;
  }

  get collectionLogoTemplate(): TemplateResult {
    return html`
      <img class="collection-logo" src=${this.logoUrl} />
    `;
  }

  get logoUrl(): string {
    return this.config ? this.config.logoUrl : '';
  }

  get waveFormProgressTemplate(): TemplateResult {
    return html`
      <waveform-progress
        interactive="true"
        .waveformUrl=${this.waveformUrl}
        .percentComplete=${this.percentComplete}
        @valuechange=${this.valueChangedFromScrub}
      >
      </waveform-progress>
    `;
  }

  get waveformUrl(): string {
    return this.config ? this.config.waveformUrl : '';
  }

  get audioElementTemplate(): TemplateResult {
    return html`
      <audio-element
        .sources=${this.audioSources}
        .playbackRate=${this.playbackRate}
        @timeupdate=${this.handleTimeChange}
        @durationchange=${this.handleDurationChange}
      >
      </audio-element>
    `;
  }

  get audioSources(): AudioSource[] {
    return this.config ? this.config.audioSources : [];
  }

  get playbackControlsTemplate(): TemplateResult {
    return html`
      <playback-controls
        @back-button-pressed=${this.backButtonHandler}
        @play-pause-button-pressed=${this.playPauseButtonHandler}
        @forward-button-pressed=${this.forwardButtonHandler}
      >
      </playback-controls>
    `;
  }

  get scrubberBarTemplate(): TemplateResult {
    return html`
      <scrubber-bar .value=${this.percentComplete} @valuechange=${this.valueChangedFromScrub}>
      </scrubber-bar>
    `;
  }

  get transcriptViewTemplate(): TemplateResult {
    return html`
      <div class="transcript-container">
        <transcript-view
          .config=${this.transcriptConfig}
          .currentTime=${this.currentTime}
          @transcriptEntrySelected=${this.transcriptEntrySelected}
        >
        </transcript-view>
      </div>
    `;
  }

  get searchSectionTemplate(): TemplateResult {
    return html`
      <div class="search-section">
        <input type="text" class="search-box" placeholder="Search" value="${this.searchTerm}" />
      </div>
    `;
  }

  get transcriptEntries(): TranscriptEntryConfig[] {
    return this.transcriptConfig ? this.transcriptConfig.entries : [];
  }

  get audioElement(): AudioElement | null {
    return this.shadowRoot
      ? (this.shadowRoot.querySelector('audio-element') as AudioElement)
      : null;
  }

  changePlaybackRate(e: Event): void {
    const target = e.target as HTMLFormElement;
    this.playbackRate = target.value;
  }

  backButtonHandler(): void {
    if (this.audioElement) {
      this.audioElement.seekBy(-10);
    }
  }

  playPauseButtonHandler(): void {
    this.isPlaying = !this.isPlaying;
    if (!this.audioElement) {
      return;
    }
    if (this.isPlaying) {
      this.audioElement.play();
    } else {
      this.audioElement.pause();
    }
  }

  forwardButtonHandler(): void {
    if (this.audioElement) {
      this.audioElement.seekBy(10);
    }
  }

  handleDurationChange(e: CustomEvent): void {
    this.duration = e.detail.duration;
  }

  handleTimeChange(e: CustomEvent): void {
    this.currentTime = e.detail.currentTime;
    const percent = this.currentTime / this.duration;
    this.percentComplete = percent * 100;
  }

  valueChangedFromScrub(e: CustomEvent): void {
    const percentage = e.detail.value;
    const newTime = this.duration * (percentage / 100);
    if (this.audioElement) {
      this.audioElement.seekTo(newTime);
    }
    this.percentComplete = percentage;
  }

  transcriptEntrySelected(e: CustomEvent): void {
    const newTime = e.detail.entry.startTime;
    if (this.audioElement) {
      this.audioElement.seekTo(newTime);
    }
  }

  static get styles(): CSSResult {
    const titleColorCss = css`var(--titleColor, white)`;
    const titleFontCss = css`var(--titleFont, 2em sans-serif)`;

    const dateColorCss = css`var(--dateColor, white)`;
    const dateFontCss = css`var(--dateFont, 1.5em sans-serif)`;

    return css`
      main {
        display: grid;
        grid-gap: 0.5rem;
      }

      /* mobile view */
      @media (max-width: 650px) {
        main {
          grid-template-columns: 25% 1fr;
          grid-template-areas:
            'collection-logo title-date'
            'waveform-scrubber waveform-scrubber'
            'playback-controls playback-controls'
            'search-section search-section'
            'transcript-container transcript-container';
        }
        .date {
          text-align: left;
        }
        transcript-view {
          --timeDisplay: none;
        }
        .search-box {
          width: 75%;
        }
      }

      /* wide view */
      @media (min-width: 650px) {
        main {
          grid-template-columns: 192px 200px 1fr;
          grid-template-areas:
            'title-date title-date title-date'
            'collection-logo playback-controls waveform-scrubber'
            'search-section transcript-container transcript-container';
        }
        .title-date {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        transcript-view {
          --timeDisplay: block;
        }
        .search-box {
          width: 172px;
        }
      }

      .title-date {
        grid-area: title-date;
      }

      .title {
        color: ${titleColorCss};
        font: ${titleFontCss};
      }

      .date {
        color: ${dateColorCss};
        font: ${dateFontCss};
      }

      waveform-progress {
        width: 100%;
        height: 3rem;
      }

      playback-controls {
        grid-area: playback-controls;
      }

      .transcript-container {
        grid-area: transcript-container;
      }

      transcript-view {
        max-width: 600px;
        display: block;
      }

      .collection-logo {
        width: 100%;
        object-fit: contain;
        grid-area: collection-logo;
        align-self: center;
      }

      .waveform-scrubber-container {
        width: 100%;
        height: 100%;
        grid-area: waveform-scrubber;
      }

      .search-section {
        grid-area: search-section;
      }

      .search-box {
        margin: auto;
        display: block;
        border-radius: 10px;
        border: 0;
        padding: 5px 10px;
      }
    `;
  }
}
