import { VoteElement } from './elements/custom-vote-element.js';

const name = "custom-vote";
if (!customElements.get(name)) {
    customElements.define(name, VoteElement);
}
