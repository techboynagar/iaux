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

import MagnifyingGlass from './assets/img/magnifying-glass';
import DisclosureTriangle from './assets/img/disclosure';

@customElement('search-bar')
export default class SearchBar extends LitElement {
  @property({ type: Boolean }) isOpen = false;

  @property({ type: Boolean }) showsDisclosure = false;

  @property({ type: String }) searchTerm = '';

  @property({ type: Array }) quickSearches: string[] = [];

  render(): TemplateResult {
    return html`
      <div
        class="
          container
          ${this.isOpen ? 'is-open' : ''}
          ${this.showsDisclosure ? 'shows-disclosure' : ''}">
        <div class="search-bar">
          <div class="magnifier-container endcap">
            ${MagnifyingGlass}
          </div>
          <input
            type="text"
            class="search-input"
            placeholder="Search"
            value=${this.searchTerm}
            @input=${this.emitInputChangeEvent}
          />
          <div class="disclosure-container endcap">
            <button @click=${this.toggleDisclosure}>
              ${DisclosureTriangle}
            </button>
          </div>
        </div>
        <div class="quick-search">
          <quick-search
            .quickSearches=${this.quickSearches}
            @searchTermSelected=${this.doQuickSearch}
          >
          </quick-search>
        </div>
      </div>
    `;
  }

  private emitInputChangeEvent(): void {
    const value = this.searchInput && this.searchInput.value;
    const event = new CustomEvent('inputchange', {
      detail: { value: value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private doQuickSearch(e: CustomEvent): void {
    this.searchTerm = e.detail.searchTerm;
    this.isOpen = false;
  }

  private toggleDisclosure(): void {
    this.isOpen = !this.isOpen;
  }

  private get searchInput(): HTMLInputElement | null {
    return this.shadowRoot && (this.shadowRoot.querySelector('.search-input') as HTMLInputElement);
  }

  private updateSearchChange(): void {
    if (!this.searchInput) {
      return;
    }
    this.searchInput.value = this.searchTerm;
    this.emitInputChangeEvent();
  }

  updated(changedProperties: PropertyValues): void {
    if (changedProperties.has('searchTerm')) {
      // for some reason, the input will not update automatically if the user has interacted with it
      // so this just sets it manually
      this.updateSearchChange();
    }
  }

  static get styles(): CSSResult {
    return css`
      .container {
        position: relative;
      }

      .search-bar {
        display: flex;
        justify-content: flex-start;
      }
      .endcap {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 2em;
        border: 1px solid white;
        flex: 0 0 2em;
      }
      .endcap svg {
        height: 1.5em;
      }

      .magnifier-container {
        border-radius: 1em 0 0 1em;
        border-right: 0;
      }
      .container.is-open.shows-disclosure .magnifier-container {
        border-radius: 1em 0 0 0;
      }
      .disclosure-container {
        border-radius: 0 1em 1em 0;
        display: none;
      }
      .container.shows-disclosure .disclosure-container {
        display: flex;
      }
      .container.is-open .disclosure-container {
        border-radius: 0 1em 0 0;
      }
      .disclosure-container button {
        border: 0;
        background: none;
      }

      .search-input {
        height: 2em;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        border-left: 0;
        border-radius: 0 1rem 1rem 0;
        background-color: black;
        color: white;
        padding: 5px 0;
        margin: 0;
        flex: 1 1 auto;
      }

      .container.shows-disclosure .search-input {
        border-right: 0;
        border-radius: 0;
      }

      .search-input:focus {
        outline: none;
      }

      .quick-search {
        color: white;
        border-radius: 0 0 1em 1em;
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        background-color: black;
        z-index: 1;
        max-height: 150px;
        overflow-y: scroll;
        scrollbar-width: none;
        padding: 0 0.5em;
      }

      .quick-search::-webkit-scrollbar {
        display: none;
      }

      .container.is-open.shows-disclosure .quick-search {
        border: 1px solid white;
        border-top: 0;
        display: block;
      }
    `;
  }
}
