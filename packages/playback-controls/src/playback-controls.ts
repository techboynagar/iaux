import { LitElement, html, css, customElement, property, TemplateResult } from 'lit-element';
import { PlaybackMode } from './playback-mode';

import replayImage from './assets/img/replay';
import skipAheadImage from './assets/img/skip-ahead';
import playImage from './assets/img/play';
import pauseImage from './assets/img/pause';
import playbackSpeedImage from './assets/img/playback-speed';

import volumeFullImage from './assets/img/volume/volume-full';
import volumeMediumImage from './assets/img/volume/volume-medium';
import volumeMuteImage from './assets/img/volume/volume-mute';

@customElement('playback-controls')
export default class PlaybackControls extends LitElement {
  @property({ type: PlaybackMode }) playbackMode = PlaybackMode.paused;

  @property({ type: Number }) playbackSpeed = 1;

  @property({ type: Number }) volume = 1;

  render(): TemplateResult {
    return html`
      <div class="container">
        <div class="vertical-button-stack playback-speed">
          <div class="vertical-button-container">
            <button class="unstyled-button" @click="${this.handlePlaybackSpeedChange}">
              ${playbackSpeedImage}
            </button>
          </div>
          <div class="vertical-button-value">
            ${this.playbackSpeed}x
          </div>
        </div>
        <button id="back-btn" class="jump-btn unstyled-button" @click="${this.handleBackButton}">
          ${replayImage}
        </button>
        <button id="play-pause-btn" @click="${this.handlePlayPauseButton}">
          ${this.playPauseButtonImage}
        </button>
        <button id="forward-btn" class="jump-btn unstyled-button" @click="${this.handleForwardButton}">
          ${skipAheadImage}
        </button>
        <div class="vertical-button-stack volume">
          <div class="vertical-button-container">
            <button class="unstyled-button" @click="${this.handleVolumeChange}">
              ${this.volumeButtonImage}
            </button>
          </div>
          <div class="vertical-button-value">
            ${this.volume * 100}%
          </div>
        </div>
      </div>
    `;
  }

  get playPauseButtonImage() {
    var image = playImage;
    switch (this.playbackMode) {
      case PlaybackMode.playing:
        image = pauseImage;
        break;
      case PlaybackMode.paused:
        image = playImage;
        break;
    }
    return image;
  }

  get volumeButtonImage(): TemplateResult {
    var image = volumeMediumImage;
    if (this.volume === 0) {
      image = volumeMuteImage;
    }
    if (this.volume === 1) {
      image = volumeFullImage;
    }
    return image
  }

  handlePlaybackSpeedChange() {
    if (this.playbackSpeed === 2.0) {
      this.playbackSpeed = 0.5;
    } else {
      this.playbackSpeed += 0.25;
    }

    const event = new CustomEvent('playbackSpeedChange', {
      detail: { playbackSpeed: this.playbackSpeed },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  handleVolumeChange() {
    if (this.volume === 1) {
      this.volume = 0;
    } else {
      this.volume += 0.25;
    }

    const event = new CustomEvent('volumeChange', {
      detail: { playbackSpeed: this.volume },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  handleBackButton() {
    const event = new Event('back-button-pressed');
    this.dispatchEvent(event);
  }

  handlePlayPauseButton() {
    this.playbackMode = this.playbackMode === PlaybackMode.playing ? PlaybackMode.paused : PlaybackMode.playing;
    const event = new Event('play-pause-button-pressed');
    this.dispatchEvent(event);
  }

  handleForwardButton() {
    const event = new Event('forward-button-pressed');
    this.dispatchEvent(event);
  }

  static get styles() {
    return css`
      .container {
        display: flex;
        justify-content: space-between;
        color: white;
      }

      .vertical-button-stack {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .vertical-button-container svg {
        vertical-align: bottom;
      }

      .vertical-button-value {
        font-size: 0.8em;
        text-align: center;
      }

      #play-pause-btn {
        border-radius: 50%;
        /* width: 5rem;
        height: 5rem; */
        max-height: 5rem;
        max-width: 5rem;
        border: none;
        background-color: white;
        vertical-align: middle;
      }

      #play-pause-btn:active {
        background-color: rgba(255, 255, 255, 0.75);
      }

      #play-pause-btn svg {
        width: 100%;
        height: 100%;
      }

      .unstyled-button {
        background: none;
        border: none;
      }

      .jump-btn:active img {
        opacity: 0.75;
      }
    `;
  }
}
