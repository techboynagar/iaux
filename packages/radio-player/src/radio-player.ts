import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
  PropertyValues,
} from 'lit-element';
import { AudioElement, AudioSource } from '@internetarchive/audio-element';
import { TranscriptConfig, TranscriptEntryConfig } from '@internetarchive/transcript-view';
import RadioPlayerConfig from './models/radio-player-config';

import '@internetarchive/waveform-progress';
import '@internetarchive/playback-controls';
import '@internetarchive/scrubber-bar';

import './search-bar/search-bar';
import './quick-search';
import MusicZone from './models/music-zone';
import { ZoneOfSilence } from '@internetarchive/waveform-progress';

@customElement('radio-player')
export default class RadioPlayer extends LitElement {
  @property({ type: RadioPlayerConfig }) config: RadioPlayerConfig | undefined = undefined;

  @property({ type: TranscriptConfig }) transcriptConfig: TranscriptConfig | undefined = undefined;

  @property({ type: Number }) currentTime = 0;

  @property({ type: String }) private searchTerm = '';

  @property({ type: Number }) private percentComplete = 0;

  @property({ type: Boolean }) private isPlaying = false;

  @property({ type: Number }) private duration = 0;

  @property({ type: Number }) private playbackRate = 1;

  private musicZones: MusicZone[] = [];

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

  private get titleDateTemplate(): TemplateResult {
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

  private get collectionLogoTemplate(): TemplateResult {
    return html`
      <img class="collection-logo" src=${this.logoUrl} />
    `;
  }

  private get logoUrl(): string {
    return this.config ? this.config.logoUrl : '';
  }

  private get waveFormProgressTemplate(): TemplateResult {
    return html`
      <waveform-progress
        interactive="true"
        .zonesOfSilence=${this.zonesOfSilence}
        .waveformUrl=${this.waveformUrl}
        .percentComplete=${this.percentComplete}
        @valuechange=${this.valueChangedFromScrub}
      >
      </waveform-progress>
    `;
  }

  private get zonesOfSilence(): ZoneOfSilence[] {
    if (this.duration === 0) { return []; }

    const musicEntries: TranscriptEntryConfig[] = this.transcriptEntries.filter((entry: TranscriptEntryConfig) => {
      return entry.isMusic === true;
    })

    const zonesOfSilence: ZoneOfSilence[] = musicEntries.map((entry: TranscriptEntryConfig) => {
      const startPercent: number = (entry.start / this.duration) * 100;
      const endPercent: number = (entry.end / this.duration) * 100;
      return new ZoneOfSilence(startPercent, endPercent);
    });

    return zonesOfSilence;
  }

  private get waveformUrl(): string {
    return this.config ? this.config.waveformUrl : '';
  }

  private get audioElementTemplate(): TemplateResult {
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

  private get audioSources(): AudioSource[] {
    return this.config ? this.config.audioSources : [];
  }

  private get playbackControlsTemplate(): TemplateResult {
    return html`
      <playback-controls
        @back-button-pressed=${this.backButtonHandler}
        @play-pause-button-pressed=${this.playPauseButtonHandler}
        @forward-button-pressed=${this.forwardButtonHandler}
      >
      </playback-controls>
    `;
  }

  private get scrubberBarTemplate(): TemplateResult {
    return html`
      <scrubber-bar .value=${this.percentComplete} @valuechange=${this.valueChangedFromScrub}>
      </scrubber-bar>
    `;
  }

  private get transcriptViewTemplate(): TemplateResult {
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

  private get searchSectionTemplate(): TemplateResult {
    // The mobile and desktop search sections work similarly, but the mobile version has
    // a dropdown area on it and the desktop version does not.
    // This is a case where the functionality is different enough to have two instances
    // of it instead of one and just show and hide them based on the media query.
    return html`
      <div class="desktop-search-section">
        <search-bar
          searchTerm=${this.searchTerm}
          .quickSearches=${this.quickSearches}
          @inputchange=${this.updateSearchTerm}
        >
        </search-bar>

        <h2>Quick Search</h2>
        <div class="quick-search-container">
          <quick-search
            .quickSearches=${this.quickSearches}
            @searchTermSelected=${this.doQuickSearch}
          >
          </quick-search>
        </div>
      </div>

      <div class="mobile-search-section">
        <search-bar
          searchTerm=${this.searchTerm}
          .quickSearches=${this.quickSearches}
          showsDisclosure="true"
          @inputchange=${this.updateSearchTerm}
        >
        </search-bar>
      </div>
    `;
  }

  private get quickSearches(): string[] {
    return this.config ? this.config.quickSearches : [];
  }

  private updateSearchTerm(e: CustomEvent): void {
    this.searchTerm = e.detail.value;
  }

  private doQuickSearch(e: CustomEvent): void {
    this.searchTerm = e.detail.searchTerm;
  }

  private get transcriptEntries(): TranscriptEntryConfig[] {
    return this.transcriptConfig ? this.transcriptConfig.entries : [];
  }

  private get audioElement(): AudioElement | null {
    return this.shadowRoot
      ? (this.shadowRoot.querySelector('audio-element') as AudioElement)
      : null;
  }

  private changePlaybackRate(e: Event): void {
    const target = e.target as HTMLFormElement;
    this.playbackRate = target.value;
  }

  private backButtonHandler(): void {
    if (this.audioElement) {
      this.audioElement.seekBy(-10);
    }
  }

  private playPauseButtonHandler(): void {
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

  private forwardButtonHandler(): void {
    if (this.audioElement) {
      this.audioElement.seekBy(10);
    }
  }

  private handleDurationChange(e: CustomEvent): void {
    this.duration = e.detail.duration;
  }

  private handleTimeChange(e: CustomEvent): void {
    this.currentTime = e.detail.currentTime;
    const percent = this.currentTime / this.duration;
    this.percentComplete = percent * 100;
  }

  private valueChangedFromScrub(e: CustomEvent): void {
    const percentage = e.detail.value;
    const newTime = this.duration * (percentage / 100);
    if (this.audioElement) {
      this.audioElement.seekTo(newTime);
    }
    this.percentComplete = percentage;
  }

  private transcriptEntrySelected(e: CustomEvent): void {
    const newTime = e.detail.entry.startTime;
    if (this.audioElement) {
      this.audioElement.seekTo(newTime);
    }
  }

  private updateMusicZones(): void {
    const musicEntries: TranscriptEntryConfig[] = this.transcriptEntries.filter((entry: TranscriptEntryConfig) => {
      return entry.isMusic === true;
    })

    const musicZones: MusicZone[] = musicEntries.map((entry: TranscriptEntryConfig) => {
      return new MusicZone(entry.start, entry.end);
    });

    this.musicZones = musicZones;
  }

  private checkForMusicZone(): void {
    const activeMusicZone: MusicZone | undefined = this.musicZones.find((zone: MusicZone) => {
      return this.currentTime > zone.start && this.currentTime < zone.end;
    });

    if (activeMusicZone && this.audioElement) {
      this.audioElement.seekTo(activeMusicZone.end + 0.1);
    }
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('transcriptConfig')) {
      this.updateMusicZones();
    }

    if (changedProperties.has('currentTime')) {
      this.checkForMusicZone();
    }
  }

  static get styles(): CSSResult {
    const titleColorCss = css`var(--titleColor, white)`;
    const titleFontCss = css`var(--titleFont, 1.5em sans-serif)`;

    const dateColorCss = css`var(--dateColor, white)`;
    const dateFontCss = css`var(--dateFont, 1em sans-serif)`;

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
            'mobile-search-section mobile-search-section'
            'transcript-container transcript-container';
        }
        .date {
          text-align: left;
        }
        transcript-view {
          --timeDisplay: none;
        }
        search-bar {
          width: 75%;
        }
        .desktop-search-section {
          display: none;
        }
      }

      /* wide view */
      @media (min-width: 650px) {
        main {
          grid-template-columns: 192px 175px 1fr;
          grid-template-areas:
            'title-date title-date title-date'
            'collection-logo playback-controls waveform-scrubber'
            'desktop-search-section transcript-container transcript-container';
        }
        .title-date {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        transcript-view {
          --timeDisplay: block;
        }
        .mobile-search-section {
          display: none;
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

      .mobile-search-section {
        grid-area: mobile-search-section;
      }

      .desktop-search-section {
        grid-area: desktop-search-section;
      }

      .desktop-search-section h2 {
        color: white;
        margin: 0.5em 0.5em 0 0.5em;
        font-size: 1em;
        font-weight: normal;
      }

      .quick-search-container {
        max-height: 150px;
        overflow-y: scroll;
        scrollbar-width: none;
        margin: 0 0.5em;
      }

      .quick-search-container::-webkit-scrollbar {
        display: none;
      }

      search-bar {
        display: block;
        margin: auto;
      }
    `;
  }
}
