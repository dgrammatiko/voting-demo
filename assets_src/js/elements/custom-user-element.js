import Auth from "https://unpkg.com/firebase-auth-lite"; //"firebase-auth-lite";
import { render, html } from "https://unpkg.com/uhtml?module"; //"uhtml";

window.userObject = window.userObject || {};

const auth = new Auth({
  apiKey: "AIzaSyC45JnUmfwYCClZO8CiOmJMEWiLW-QrCvM",
  redirectUri: 'http://localhost/'
});

const authListener = auth.listen(user => { window.userObject = user });

// This runs in the `redirectUri` location.
auth.handleSignInRedirect();

class UserElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.renderEl();
  }

  renderEl() {
    if (!window.userObject) {
      render(this, html`<button onclick=${this.handleSignIn}>Sign in</button>`);
    } else {
      render(this, html`<button onclick=${this.handleSignOut}>Sign Out</button>`);
    }
  }

  handleSignIn() {
    auth.signInWithProvider("google.com");
  }

  handleSignOut() {
    auth.signOut()
    authListener();
  }
}

export { UserElement };
