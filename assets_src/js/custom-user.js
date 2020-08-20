import { UserElement } from './elements/custom-user-element.js';

const name = "custom-user";
if (!customElements.get(name)) {
    customElements.define(name, UserElement);
}
