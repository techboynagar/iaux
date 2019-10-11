import { LitElement, html, css } from 'lit-element';

import userMenuRef from './assets/menu-groups/user';

class UserMenu extends LitElement {
  static get properties() {
    return {
      userMenuOpen: { type: Boolean },
      userMenuAnimate: { type: Boolean },
      user: { type: Object }
    };
  }

  constructor() {
    super();

    this.user = null;
  }

  get dropdownMenuTemplate() {
    const { user } = this;
    const { loggedOut, loggedIn } = userMenuRef;
    const links = user ? loggedIn : loggedOut;

    return links.map(({ link, label }) => html`
      <a href="${link}">${label}</a>
    `);
  }

  render() {
    let userMenuClass = 'initial';
    if (this.userMenuOpen) {
      userMenuClass = 'open';
    }
    if (!this.userMenuOpen && this.userMenuAnimate) {
      userMenuClass = 'closed';
    }

    const userMenuHidden = Boolean(!this.userMenuOpen).toString();
    const userMenuExpanded = Boolean(this.userMenuOpen).toString();

    const username = this.user ? html`<a href="#">USERNAME</a>` : '';
    const userSession = this.user ? 'logged-in' : 'logged-out';
    return html`
      <nav
        class="user-menu tx-slide ${userMenuClass}"
        aria-hidden="${userMenuHidden}"
        aria-expanded="${userMenuExpanded}"
      >
        <div class="menu-group ${userSession}">
          ${username}
          ${this.dropdownMenuTemplate}
        </div>
      </nav>
    `;
  }

  static get styles() {
    return css`
      .user-menu {
        margin: 0;
        float: right;
        background-color: var(--grey20);
      }
      .user-menu.tx-slide {
        overflow: hidden;
        transition-property: max-height;
        transition-duration: 1.5s;
        transition-timing-function: ease;
      }
      .user-menu.tx-slide.initial,
      .user-menu.tx-slide.closed {
        max-height: 0;
      }
      .user-menu.tx-slide.closed {
        transition-duration: 0.1s;
      }
      .user-menu.tx-slide.open {
        max-height: 100vh;
        max-width: 100vw;
      }
      .user-menu .menu-group {
        min-width: 30vw;
        margin: 4% auto;
      }
      .user-menu .menu-group.logged-out {
        min-height: 6vh;
        max-height: 20vh;
      }
      .user-menu .menu-group.logged-in {
        min-height: 50vh;
      }
      .user-menu .menu-group a {
        display: block;
        width: 100%;
        color: var(--primary-text-color);
        text-decoration: none;
        height: 8%;
        padding: 2.5% 5%;
      }
    `;
  }
}

customElements.define('user-menu', UserMenu);
