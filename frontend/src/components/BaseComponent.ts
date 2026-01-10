export abstract class BaseComponent extends HTMLElement {
    protected shadow: ShadowRoot;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    protected abstract template(): string;
    protected styles(): string {
        return "";
    }

    protected render() {
        this.shadow.innerHTML = `
            <style>${this.styles()}</style>
            ${this.template()}
        `;
    }
}

