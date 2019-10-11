/* global: $ */

import { LitElement, html, css } from 'lit-element';

import '../index';

const getUserInfo = () => {
  const betaMetaTag = document.querySelector('meta[property="ia:archive-user"]') || null;
  const isBeta = betaMetaTag && betaMetaTag.getAttribute('content') === 'true';

  const userInfo = null;
  return {
    isBeta,
    userInfo,
  };
};

class MobileNavController extends LitElement {
  static get properties() {
    return {
      user: { type: Object },
      isBeta: { type: Boolean },
      search: { type: Object },
    };
  }

  constructor() {
    super();

    const { isBeta, userInfo } = getUserInfo();
    this.user = userInfo;
    this.isBeta = isBeta;
    this.search = {
      type: '',
      input: '',
    };
  }

  fireSearch(e) {
    console.log('controllerrrr', e);

    this.search.input = e.detail.term;

    const { input, type: searchType } = this.search;
    if (input && searchType) {
      // make url
      console.log('Search this', this.search);
    }
  }

  searchTypeSelected(e) {
    this.search.type = e.detail.searchType;
    console.log('controller - type captured', this.search);
  }

  searchThisValue(e) {
    console.log('searchThisValue', e);
    this.search.input = e.detail;
    // make url and switch page
    console.log('search', this.search);
  }

  render() {
    return html`
      <topnav-element
        .user="${this.user}"
        @fireSearch=${this.fireSearch}
        @searchTypeSelected=${this.searchTypeSelected}
      ></topnav-element>
    `;
  }

  static get styles() {
    return css``;
  }
}

customElements.define('mobile-nav', MobileNavController);
