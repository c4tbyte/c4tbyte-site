const CATEGORIES = [
  {
    label: "Ecommerce",
    bubbles: [
      { name: "Big Cartel", src: "/images/logos/big-cartel.png", shape: "pill" },
      { name: "Shopify", src: "/images/logos/shopify.png", shape: "circle" },
      { name: "Stripe", src: "/images/logos/stripe.png", shape: "circle" },
    ],
  },
  {
    label: "Ticketing & Events",
    bubbles: [
      { name: "Ticketmaster", src: "/images/logos/ticketmaster.png", shape: "pill" },
      { name: "Songkick", src: "/images/logos/songkick.png", shape: "circle" },
      { name: "Bandsintown", src: "/images/logos/bandsintown.png", shape: "circle" },
      { name: "Eventbrite", src: "/images/logos/eventbrite.png", shape: "circle" },
    ],
  },
  {
    label: "Streaming",
    bubbles: [
      { name: "Spotify", src: "/images/logos/spotify.png", shape: "circle" },
      { name: "SoundCloud", src: "/images/logos/soundcloud.png", shape: "circle" },
      { name: "Apple Music", src: "/images/logos/apple-music.png", shape: "pill" },
      { name: "Bandcamp", src: "/images/logos/bandcamp.png", shape: "circle" },
    ],
  },
  {
    label: "Fan Engagement",
    bubbles: [
      { name: "YouTube", src: "/images/logos/youtube.png", shape: "pill" },
      { name: "Discord", src: "/images/logos/discord.png", shape: "circle" },
      { name: "Patreon", src: "/images/logos/patreon.png", shape: "circle" },
      { name: "Mailchimp", src: "/images/logos/mailchimp.png", shape: "circle" },
    ],
  },
];

const IX_TEMPLATE = document.createElement("template");
IX_TEMPLATE.innerHTML = `
<style>
  :host {
    --ix-bg: #0a0a0a;
    --ix-fg: #ffffff;
    --ix-muted: #9a9a9a;
    --ix-panel: #131313;
    --ix-border: #2b2b2b;
    --ix-bubble-bg: #ffffff;
    --ix-bubble-fg: #0a0a0a;
    --ix-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --ix-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --ix-label-tracking: 0.08em;
    --ix-padding: 28px;
    --ix-box-width: 320px;
    --ix-box-height: 240px;
    --ix-box-gap: 20px;

    position: relative;
    display: block;
    background: var(--ix-bg);
    color: var(--ix-fg);
    font-family: var(--ix-font-body);
    padding: var(--ix-padding);
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  h2 {
    margin: 0 0 8px;
    font-family: var(--ix-font-heading);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: var(--ix-label-tracking);
    text-transform: uppercase;
  }

  .subtext {
    margin: 0;
    font-family: var(--ix-font-body);
    font-size: 18px;
    letter-spacing: 0.08em;
    color: #cfcfcf;
  }

  .categories {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--ix-box-gap);
  }

  .category {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .field {
    position: relative;
    width: var(--ix-box-width);
    height: var(--ix-box-height);
    background: var(--ix-panel);
    border: 1px solid var(--ix-border);
    overflow: hidden;
  }

  .category-label {
    margin-top: 10px;
    font-size: 12px;
    letter-spacing: var(--ix-label-tracking);
    text-transform: uppercase;
    color: var(--ix-fg);
    font-weight: 700;
  }

  .bubble {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    will-change: transform, width, height;
    cursor: default;
  }

  .bubble img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
</style>

<div class="header">
  <h2 part="title"></h2>
  <p class="subtext" part="subtext"></p>
</div>
<div class="categories"></div>
`;

class Bubble {
  constructor(el, def, fieldW, fieldH, index, total) {
    this.el = el;
    this.def = def;
    this.fieldW = fieldW;
    this.fieldH = fieldH;

    const isPill = def.shape === "pill";
    this.baseW = isPill ? 130 : 84;
    this.baseH = isPill ? 56 : 84;
    this.hoverScale = 1.35;

    this.w = this.baseW;
    this.h = this.baseH;
    this.targetW = this.baseW;
    this.targetH = this.baseH;

    const fieldPadding = 28;
    const usableW = fieldW - fieldPadding * 2;
    const usableH = fieldH - fieldPadding * 2;

    const columns = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / columns);
    const cellW = usableW / columns;
    const cellH = usableH / rows;
    const col = index % columns;
    const row = Math.floor(index / columns);

    const jitterX = (Math.random() - 0.5) * cellW * 0.2;
    const jitterY = (Math.random() - 0.5) * cellH * 0.2;

    this.x = fieldPadding + (col + 0.5) * cellW + jitterX;
    this.y = fieldPadding + (row + 0.5) * cellH + jitterY;

    this.restX = this.x;
    this.restY = this.y;

    this.hovered = false;
  }

  radius() {
    return Math.max(this.w, this.h) / 2;
  }

  setHovered(isHovered) {
    this.hovered = isHovered;
    this.targetW = isHovered ? this.baseW * this.hoverScale : this.baseW;
    this.targetH = isHovered ? this.baseH * this.hoverScale : this.baseH;
  }

  update() {
    this.w += (this.targetW - this.w) * 0.15;
    this.h += (this.targetH - this.h) * 0.15;

    if (!this.hovered) {
      this.x += (this.restX - this.x) * 0.08;
      this.y += (this.restY - this.y) * 0.08;
    }
  }

  clampToBounds() {
    const r = this.radius();
    const padding = 28;
    this.x = Math.min(Math.max(this.x, padding + r), this.fieldW - padding - r);
    this.y = Math.min(Math.max(this.y, padding + r), this.fieldH - padding - r);
  }

  render() {
    this.el.style.width = `${this.w}px`;
    this.el.style.height = `${this.h}px`;
    this.el.style.transform = `translate(${this.x - this.w / 2}px, ${this.y - this.h / 2}px)`;
  }
}

class BubbleField {
  constructor(container, defs) {
    this.container = container;
    this.fieldW = container.clientWidth;
    this.fieldH = container.clientHeight;

    this.bubbles = defs.map((def, index) => {
      const el = document.createElement("div");
      el.className = "bubble";
      el.innerHTML = `<img src="${def.src}" alt="${def.name}" loading="lazy" />`;
      container.appendChild(el);

      const bubble = new Bubble(el, def, this.fieldW, this.fieldH, index, defs.length);

      el.addEventListener("mouseenter", () => bubble.setHovered(true));
      el.addEventListener("mouseleave", () => bubble.setHovered(false));

      return bubble;
    });

    this._lastTime = performance.now();
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }

  _resolveCollisions() {
    const padding = 6;
    for (let i = 0; i < this.bubbles.length; i++) {
      for (let j = i + 1; j < this.bubbles.length; j++) {
        const a = this.bubbles[i];
        const b = this.bubbles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const minDist = a.radius() + b.radius() + padding;

        if (dist < minDist) {
          const overlap = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;

          const aMovable = !a.hovered;
          const bMovable = !b.hovered;

          if (aMovable) {
            a.x -= nx * overlap * (bMovable ? 1 : 2);
            a.y -= ny * overlap * (bMovable ? 1 : 2);
          }
          if (bMovable) {
            b.x += nx * overlap * (aMovable ? 1 : 2);
            b.y += ny * overlap * (aMovable ? 1 : 2);
          }
        }
      }
    }
  }

  _loop(now) {
    const dt = Math.min(now - this._lastTime, 50);
    this._lastTime = now;

    this.bubbles.forEach((b) => b.update());
    this._resolveCollisions();
    this.bubbles.forEach((b) => {
      b.clampToBounds();
      b.render();
    });

    this._raf = requestAnimationFrame(this._loop.bind(this));
  }

  destroy() {
    if (this._raf) cancelAnimationFrame(this._raf);
  }
}

class IntegrationsStrip extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtext"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(IX_TEMPLATE.content.cloneNode(true));
    this._fields = [];
  }

  connectedCallback() {
    this._render();
    this._buildCategories();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get titleText() { return this.getAttribute("title") || "Integrations"; }
  get subtextValue() { return this.getAttribute("subtext") || ""; }

  _render() {
    const root = this.shadowRoot;
    root.querySelector("h2").textContent = this.titleText;
    root.querySelector(".subtext").textContent = this.subtextValue;
  }

  _buildCategories() {
    const container = this.shadowRoot.querySelector(".categories");
    container.innerHTML = "";
    this._fields.forEach((f) => f.destroy());
    this._fields = [];

    CATEGORIES.forEach((category) => {
      const categoryEl = document.createElement("div");
      categoryEl.className = "category";

      const fieldEl = document.createElement("div");
      fieldEl.className = "field";

      const labelEl = document.createElement("div");
      labelEl.className = "category-label";
      labelEl.textContent = category.label;

      categoryEl.appendChild(fieldEl);
      categoryEl.appendChild(labelEl);
      container.appendChild(categoryEl);

      this._fields.push(new BubbleField(fieldEl, category.bubbles));
    });
  }
}

customElements.define("integrations-strip", IntegrationsStrip);