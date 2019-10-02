import {
  LitElement,
  html,
  css,
  customElement,
  property,
  CSSResult,
  TemplateResult,
} from 'lit-element';

import MagnifyingGlass from './assets/img/magnifying-glass';
import DisclosureTriangle from './assets/img/disclosure';

@customElement('search-bar')
export default class SearchBar extends LitElement {
  @property({ type: Boolean }) isOpen = true;

  @property({ type: String }) searchTerm = '';

  @property({ type: Array }) quickSearches: string[] = [
    'International relations',
    'International law',
    'Birth control',
    'Sports terminology',
    'Training',
    'Human rights',
    'Economics',
    'Law',
    'Geography terminology',
    'IOS software',
    'American football terminology',
    'Android (operating system) software',
    "Women's National Basketball Association teams",
    'Olympic medals',
    'Gold',
    'Orders, decorations, and medals',
    'Connecticut',
    'Abuse',
    'Personhood',
    'Culture',
    'Google',
    'BlackBerry software',
    'Java platform software',
    'Capitals in Asia',
    'Cigarettes',
    'Tobacco',
  ];

  render(): TemplateResult {
    return html`
      <div class="container ${this.isOpen ? 'is-open' : ''}">
        <div class="search-bar">
          <div class="magnifier-container endcap">
            ${MagnifyingGlass}
          </div>
          <input type="text" class="search-box" placeholder="Search" value=${this.searchTerm} />
          <div class="disclosure-container endcap">
            <button @click=${this.toggleDisclosure}>
              ${DisclosureTriangle}
            </button>
          </div>
        </div>
        <div class="quick-search">
          <ul>
            ${this.quickSearches.map(
              (quickSearch: string) => html`
                <li>
                  <a @click=${this.doQuickSearch} data-search-term=${quickSearch}>${quickSearch}</a>
                </li>
              `,
            )}
          </ul>
        </div>
      </div>
    `;
  }

  private doQuickSearch(e: Event): void {
    const { searchTerm } = (e.target as HTMLElement).dataset;
    if (searchTerm) {
      this.searchTerm = searchTerm;
    }
  }

  private toggleDisclosure(): void {
    this.isOpen = !this.isOpen;
  }

  static get styles(): CSSResult {
    // const searchWidthCss = css`var(--titleFont, 2em sans-serif)`;

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
      .container.is-open .magnifier-container {
        border-radius: 1em 0 0 0;
      }
      .disclosure-container {
        border-radius: 0 1em 1em 0;
      }
      .container.is-open .disclosure-container {
        border-radius: 0 1em 0 0;
      }
      .disclosure-container button {
        border: 0;
        background: none;
      }

      .search-box {
        height: 2em;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        border-left: 0;
        border-right: 0;
        background-color: black;
        color: white;
        padding: 5px 0;
        margin: 0;
        flex: 1 1 auto;
      }

      .search-box:focus {
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
      }

      .quick-search::-webkit-scrollbar {
        display: none;
      }

      .container.is-open .quick-search {
        border: 1px solid white;
        border-top: 0;
        display: block;
      }

      .quick-search ul {
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .quick-search ul li {
        padding: 0.5em 2em 0.5em 2em;
        margin: 0;
        display: block;
      }

      .quick-search ul li a {
        color: rgb(68, 132, 202);
        text-decoration: none;
        font-size: 1.1em;
        cursor: pointer;
      }
    `;
  }
}
