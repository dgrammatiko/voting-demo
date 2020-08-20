// Inspired from: https://www.w3.org/WAI/tutorials/forms/custom-controls/
import { render, html } from "https://unpkg.com/uhtml?module"; //"uhtml";

(async () => {
  const response = await fetch('https://api.ipify.org?format=json');
  const data = await response.json();
  window.currentIp = { ip: data.ip };
  Object.freeze(window.currentIp);
})();

class VoteElement extends HTMLElement {
  constructor() {
    super();
    this.selected = this.selected.bind(this);
    this.submit = this.submit.bind(this);
    this.initialValue = this.value;
    this.voteIcon = html`<svg viewBox="0 0 640 512"><path d="M608 320h-64v64h22.4c5.3 0 9.6 3.6 9.6 8v16c0 4.4-4.3 8-9.6 8H73.6c-5.3 0-9.6-3.6-9.6-8v-16c0-4.4 4.3-8 9.6-8H96v-64H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h576c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32zm-96 64V64.3c0-17.9-14.5-32.3-32.3-32.3H160.4C142.5 32 128 46.5 128 64.3V384h384zM211.2 202l25.5-25.3c4.2-4.2 11-4.2 15.2.1l41.3 41.6 95.2-94.4c4.2-4.2 11-4.2 15.2.1l25.3 25.5c4.2 4.2 4.2 11-.1 15.2L300.5 292c-4.2 4.2-11 4.2-15.2-.1l-74.1-74.7c-4.3-4.2-4.2-11 0-15.2z"></path></svg>`;
    this.starIcon = html`<svg viewBox="0 0 512 512"><path d="M512 198.525l-176.89-25.704-79.11-160.291-79.108 160.291-176.892 25.704 128 124.769-30.216 176.176 158.216-83.179 158.216 83.179-30.217-176.176 128.001-124.769z"></path></svg>`;
    this.resetIcon = html`<svg viewBox="0 0 512 512"><g stroke-width="70" stroke-linecap="square"><path d="M91.5,442.5 L409.366489,124.633512"></path><path d="M90.9861965,124.986197 L409.184248,443.184248"></path></g></svg>`;
  }

  static get observedAttributes() { return ['value']; }

  get value() {
    return parseInt(this.getAttribute('value')) || 0;
  }

  set value(value) {
    this.setAttribute('value', value);
  }

  get url() {
    return this.getAttribute('url') || '';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.renderEl();
  }

  connectedCallback() {
    this.renderEl();
  }

  renderEl() {
    const id = this.random();
    render(
      this,
      html`
<form action="#">
  <div class="stars-cont">
    <input value="0" id=${`star${id}_0`} checked=${this.value === 0 ? true : false} type="radio" name="rating" class="visuallyhidden vote-reset" onclick=${this.selected}>
    <label for=${`star${id}_0`}><span class="visuallyhidden">0 Stars</span>${this.resetIcon}</label>
    ${[1, 2, 3, 4, 5].map(item => html`
      <input value="${item}" id=${`star${id}_${item}`} checked=${this.value === item ? true : false} type="radio" name="rating" class="visuallyhidden" onclick=${this.selected}>
      <label for=${`star${id}_${item}`}><span class="visuallyhidden">${item} Star</span>${this.starIcon}</label>
    `)}
  </div>
  <div>
    ${this.value > 0 && this.value !== this.initialValue && window.currentIp ? html`<button type="button" onclick=${this.submit}>${this.voteIcon} Vote</button>` : html`<button disabled>${this.voteIcon} Vote</button>`}
  </div>
</form>`
    );
  }

  async submit(event) {
    event.preventDefault();
    event.currentTarget.setAttribute('disabled', '')
    if (!this.url) return;
    this.initialValue = this.value;
    const form = event.currentTarget.form;
    const response = await fetch(this.url, {
      method: 'POST',
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify({
        url: location.href,
        userIp: window.currentIp.ip,
        value: this.value
      })
    });

    // @todo
    console.log(response.json());
  }

  selected(event) {
    this.value = parseInt(event.currentTarget.value, 10);
  }

  random() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}

export { VoteElement };
