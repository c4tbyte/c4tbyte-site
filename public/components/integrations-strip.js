const CATEGORIES = [
  {
    label: "Ecommerce",
    bubbles: [
      { name: "Big Cartel", src: "/images/logos/big-cartel.png" },
      { name: "Shopify", src: "/images/logos/shopify.png" },
      { name: "Stripe", src: "/images/logos/stripe.png", invertOnly: true },
    ],
  },
  {
    label: "Ticketing & Events",
    bubbles: [
      { name: "Ticketmaster", src: "/images/logos/ticketmaster.png" },
      { name: "Songkick", src: "/images/logos/songkick.png" },
      { name: "Bandsintown", src: "/images/logos/bandsintown.png" },
      { name: "Eventbrite", src: "/images/logos/eventbrite.png", invertOnly: true },
    ],
  },
  {
    label: "Streaming",
    bubbles: [
      { name: "Spotify", src: "/images/logos/spotify.png" },
      { name: "SoundCloud", src: "/images/logos/soundcloud.png" },
      { name: "Apple Music", src: "/images/logos/apple-music.png" },
      { name: "Bandcamp", src: "/images/logos/bandcamp.png" },
    ],
  },
  {
    label: "Fan Engagement",
    bubbles: [
      { name: "YouTube", src: "/images/logos/youtube.png" },
      { name: "Discord", src: "/images/logos/discord.png" },
      { name: "Patreon", src: "/images/logos/patreon.png" },
      { name: "Mailchimp", src: "/images/logos/mailchimp.png" },
    ],
  },
];

function getSlots(count) {
  if (count === 3) {
    return [
      { x: 50, y: 28, w: 50, h: 38 },
      { x: 27, y: 74, w: 38, h: 38 },
      { x: 73, y: 74, w: 38, h: 38 },
    ];
  }
  if (count === 4) {
    return [
      { x: 27, y: 27, w: 38, h: 38 },
      { x: 73, y: 27, w: 38, h: 38 },
      { x: 27, y: 73, w: 38, h: 38 },
      { x: 73, y: 73, w: 38, h: 38 },
    ];
  }
  return Array.from({ length: count }, (_, i) => ({
    x: ((i + 1) / (count + 1)) * 100,
    y: 50,
    w: 80 / count,
    h: 60,
  }));
}

const IX_TEMPLATE = document.createElement("template");
IX_TEMPLATE.innerHTML = `
<style>
  :host {
    --ix-bg: #0a0a0a;
    --ix-fg: #ffffff;
    --ix-muted: #9a9a9a;
    --ix-panel: #131313;
    --ix-border: #2b2b2b;
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
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%) scale(1);
    transition: transform 0.25s ease;
    cursor: default;
  }

  .bubble.is-hovered {
    transform: translate(-50%, -50%) scale(1.3);
    z-index: 2;
  }

  .bubble.is-shrunk {
    transform: translate(-50%, -50%) scale(0.72);
  }

  .bubble img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  .bubble img.invert-only {
    filter: invert(1);
  }

  @media (max-width: 720px) {
    :host {
      --ix-box-width: 260px;
      --ix-box-height: 200px;
    }
  }

  @media (max-width: 420px) {
    :host {
      --ix-box-width: 220px;
      --ix-box-height: 180px;
    }
  }
</style>

<div class="header">
  <h2 part="title"></h2>
  <p class="subtext" part="subtext"></p>
</div>
<div class="categories"></div>
`;

class IntegrationsStrip extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtext"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(IX_TEMPLATE.content.cloneNode(true));
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

    CATEGORIES.forEach((category) => {
      const categoryEl = document.createElement("div");
      categoryEl.className = "category";

      const fieldEl = document.createElement("div");
      fieldEl.className = "field";

      const slots = getSlots(category.bubbles.length);
      const bubbleEls = category.bubbles.map((def, i) => {
        const slot = slots[i];
        const el = document.createElement("div");
        el.className = "bubble";
        el.style.left = `${slot.x}%`;
        el.style.top = `${slot.y}%`;
        el.style.width = `${slot.w}%`;
        el.style.height = `${slot.h}%`;
        el.innerHTML = `<img src="${def.src}" alt="${def.name}" loading="lazy" class="${def.invertOnly ? "invert-only" : ""}" />`;
        fieldEl.appendChild(el);
        return el;
      });

      bubbleEls.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          bubbleEls.forEach((other) => {
            if (other === el) {
              other.classList.add("is-hovered");
              other.classList.remove("is-shrunk");
            } else {
              other.classList.add("is-shrunk");
              other.classList.remove("is-hovered");
            }
          });
        });
        el.addEventListener("mouseleave", () => {
          bubbleEls.forEach((other) => {
            other.classList.remove("is-hovered", "is-shrunk");
          });
        });
      });

      const labelEl = document.createElement("div");
      labelEl.className = "category-label";
      labelEl.textContent = category.label;

      categoryEl.appendChild(fieldEl);
      categoryEl.appendChild(labelEl);
      container.appendChild(categoryEl);
    });
  }
}

customElements.define("integrations-strip", IntegrationsStrip);