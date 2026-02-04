import katex from 'katex'
import 'katex/contrib/mhchem'

class Tex extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = this.innerText
    }
}