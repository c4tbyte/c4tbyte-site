const STACK_LOGOS = [
  { name: "JavaScript", src: "/images/logos/javascript.png" },
  { name: "Python", src: "/images/logos/python.png" },
  { name: "React", src: "/images/logos/react.png" },
  { name: "Vercel", src: "/images/logos/vercel.png" },
  { name: "Cloudinary", src: "/images/logos/cloudinary-mark.png" },
  { name: "Airtable", src: "/images/logos/airtable.png" },
];

const SS_TEMPLATE = document.createElement("template");
SS_TEMPLATE.innerHTML = `
<style>
  :host {
    --ss-bg: transparent;
    --ss-fg: #ffffff;
    --ss-border: var(--border-color, #737373);
    --ss-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --ss-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --ss-label-tracking: 0.08em;
    --ss-padding: 28px;
    --ss-bar-height: 180px;
    --ss-logo-height: 56px;
    --ss-logo-gap: 64px;

    position: relative;
    display: block;
    background: var(--ss-bg);
    color: var(--ss-fg);
    font-family: var(--ss-font-body);
    padding: var(--ss-padding);
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  h2 {
    margin: 0 0 8px;
    font-family: var(--ss-font-heading);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: var(--ss-label-tracking);
    text-transform: uppercase;
  }

  .subtext {
    margin: 0;
    font-family: var(--ss-font-body);
    font-size: 18px;
    letter-spacing: 0.08em;
    color: #cfcfcf;
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--ss-logo-gap);
    height: var(--ss-bar-height);
    border: 1px solid var(--ss-border);
  }

  .logo img {
    height: var(--ss-logo-height);
    width: auto;
    max-width: 140px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  @media (max-width: 720px) {
    :host {
      --ss-bar-height: 220px;
      --ss-logo-height: 44px;
      --ss-logo-gap: 36px;
    }
  }
</style>

<div class="header">
  <h2 part="title"></h2>
  <p class="subtext" part="subtext"></p>
</div>
<div class="bar"></div>
`;

class StackStrip extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtext"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(SS_TEMPLATE.content.cloneNode(true));
  }

  connectedCallback() {
    this._render();
    this._buildBar();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get titleText() { return this.getAttribute("title") || "My Stack"; }
  get subtextValue() { return this.getAttribute("subtext") || ""; }

  _render() {
    const root = this.shadowRoot;
    root.querySelector("h2").textContent = this.titleText;
    root.querySelector(".subtext").textContent = this.subtextValue;
  }

  _buildBar() {
    const bar = this.shadowRoot.querySelector(".bar");
    bar.innerHTML = STACK_LOGOS.map(
      (logo) => `
        <div class="logo">
          <img src="${logo.src}" alt="${logo.name}" loading="lazy" />
        </div>
      `
    ).join("");
  }
}

customElements.define("stack-strip", StackStrip);