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
    layout: "oneThree",
    bubbles: [
      { name: "Ticketmaster", src: "/images/logos/ticketmaster.png" },
      { name: "Songkick", src: "/images/logos/songkick.png" },
      { name: "Bandsintown", src: "/images/logos/bandsintown.png" },
      { name: "Eventbrite", src: "/images/logos/eventbrite.png", invertOnly: true },
    ],
  },
  {
    label: "Streaming",
    layout: "grid2x2",
    bubbles: [
      { name: "Spotify", src: "/images/logos/spotify.png" },
      { name: "SoundCloud", src: "/images/logos/soundcloud.png" },
      { name: "Apple Music", src: "/images/logos/apple-music.png" },
      { name: "Bandcamp", src: "/images/logos/bandcamp.png" },
    ],
  },
  {
    label: "Fan Engagement",
    layout: "oneThree",
    bubbles: [
      { name: "YouTube", src: "/images/logos/youtube.png" },
      { name: "Discord", src: "/images/logos/discord.png" },
      { name: "Patreon", src: "/images/logos/patreon.png" },
      { name: "Mailchimp", src: "/images/logos/mailchimp.png" },
    ],
  },
];

function getSlots(count, layout) {
  if (layout === "oneThree") {
    return [
      { x: 50, y: 22, w: 200, h: 46 },
      { x: 22, y: 68, w: 70, h: 70 },
      { x: 50, y: 68, w: 70, h: 70 },
      { x: 78, y: 68, w: 70, h: 70 },
    ];
  }
  if (count === 3) {
    return [
      { x: 50, y: 22, w: 200, h: 46 },
      { x: 32, y: 68, w: 84, h: 84 },
      { x: 68, y: 68, w: 84, h: 84 },
    ];
  }
  if (layout === "grid2x2") {
    return [
      { x: 26, y: 28, w: 120, h: 64 },
      { x: 74, y: 28, w: 120, h: 64 },
      { x: 26, y: 72, w: 120, h: 64 },
      { x: 74, y: 72, w: 120, h: 64 },
    ];
  }
  if (count === 4) {
    return [
      { x: 26, y: 26, w: 88, h: 60 },
      { x: 58, y: 26, w: 80, h: 60 },
      { x: 20, y: 76, w: 80, h: 64 },
      { x: 46, y: 76, w: 80, h: 64 },
    ];
  }
  return Array.from({ length: count }, (_, i) => ({
    x: ((i + 1) / (count + 1)) * 100,
    y: 50,
    w: 90,
    h: 68,
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
    --ix-border: var(--border-color, #737373);
    --ix-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --ix-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --ix-label-tracking: 0.08em;
    --ix-padding: 28px;
    --ix-box-width: 320px;
    --ix-box-height: 180px;
    --ix-box-gap: 20px;

    position: relative;
    display: block;
    background: var(--ix-bg);
    color: var(--ix-fg);
    font-family: var(--ix-font-body);
    padding: var(--ix-padding);
    border-bottom: 1px solid var(--ix-border);
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
    background: transparent;
    border: 1px solid var(--ix-border);
    overflow: hidden;
  }

  .category-label {
    margin-top: 10px;
    font-family: var(--ix-font-heading);
    font-size: 20px;
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
    transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: default;
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

      const slots = getSlots(category.bubbles.length, category.layout);
      const bubbleEls = category.bubbles.map((def, i) => {
        const slot = slots[i];
        const el = document.createElement("div");
        el.className = "bubble";
        el.style.left = `${slot.x}%`;
        el.style.top = `${slot.y}%`;
        el.style.width = `${slot.w}px`;
        el.style.height = `${slot.h}px`;
        el.innerHTML = `<img src="${def.src}" alt="${def.name}" loading="lazy" class="${def.invertOnly ? "invert-only" : ""}" />`;
        fieldEl.appendChild(el);
        return el;
      });

      let lastHovered = null;

      const applyHoverState = (hoveredIndex) => {
        if (hoveredIndex === lastHovered) return;
        lastHovered = hoveredIndex;

        const fieldRect = fieldEl.getBoundingClientRect();

        bubbleEls.forEach((el, i) => {
          if (hoveredIndex === null) {
            el.style.transform = "translate(-50%, -50%) scale(1)";
            el.style.zIndex = "1";
            return;
          }

          if (i === hoveredIndex) {
            el.style.transform = "translate(-50%, -50%) scale(1.2)";
            el.style.zIndex = "2";
            return;
          }

          const hovered = slots[hoveredIndex];
          const slot = slots[i];
          let dx = slot.x - hovered.x;
          let dy = slot.y - hovered.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          dx /= dist;
          dy /= dist;

          const pushX = dx * fieldRect.width * 0.05;
          const pushY = dy * fieldRect.height * 0.05;

          el.style.transform = `translate(calc(-50% + ${pushX}px), calc(-50% + ${pushY}px)) scale(0.85)`;
          el.style.zIndex = "1";
        });
      };

      fieldEl.addEventListener("mousemove", (e) => {
        const rect = fieldEl.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;

        let nearest = 0;
        let nearestDist = Infinity;
        slots.forEach((slot, i) => {
          const d = (slot.x - mx) ** 2 + (slot.y - my) ** 2;
          if (d < nearestDist) {
            nearestDist = d;
            nearest = i;
          }
        });

        applyHoverState(nearest);
      });

      fieldEl.addEventListener("mouseleave", () => applyHoverState(null));

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