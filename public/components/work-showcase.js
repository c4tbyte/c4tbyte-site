const WORK_TEMPLATE = document.createElement("template");
WORK_TEMPLATE.innerHTML = `
<style>
  :host {
    --wc-bg: #0a0a0a;
    --wc-fg: #ffffff;
    --wc-muted: #6b6b6b;
    --wc-panel: #131313;
    --wc-border: #2b2b2b;
    --wc-accent: #6fdc4d;
    --wc-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --wc-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --wc-label-tracking: 0.08em;
    --wc-padding: 28px;
    --wc-column-gap: 40px;
    --wc-list-width: 260px;
    --wc-meta-width: 220px;
    --wc-item-gap: 22px;
    --wc-item-name-size: 20px;
    --wc-item-name-size-active: 26px;
    --wc-item-type-size: 11px;
    --wc-badge-size: 64px;
    --wc-preview-border: #d9d9d9;

    position: relative;
    display: block;
    overflow: hidden;
    background: var(--wc-bg);
    color: var(--wc-fg);
    font-family: var(--wc-font-body);
    padding: var(--wc-padding);
    border-bottom: 1px solid var(--wc-border);
    box-sizing: border-box;
  }

  :host::after {
    content: "";
    position: absolute;
    top: calc(-1 * var(--wc-padding));
    right: 0;
    width: 480px;
    height: calc(100% + var(--wc-padding));
    background-image: url("/images/showcase-bg.png");
    background-repeat: no-repeat;
    background-position: bottom right;
    background-size: contain;
    opacity: 0.8;
    pointer-events: none;
    z-index: 0;
  }

  * { box-sizing: border-box; }

  h2 {
    margin: 0 0 var(--wc-item-gap);
    font-family: var(--wc-font-heading);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: var(--wc-label-tracking);
    text-transform: uppercase;
  }

  .layout {
    position: relative;
    z-index: 1;
    display: flex;
    gap: var(--wc-column-gap);
    align-items: flex-start;
    flex-wrap: wrap;
  }

  /* ---- List column ---- */
  .list-col {
    flex: 0 0 var(--wc-list-width);
    min-width: 0;
  }

  .item-list {
    list-style: none;
    margin: 0 0 20px;
    padding: 0;
  }

  .item-list li {
    padding: 10px 0;
    border-bottom: 1px solid var(--wc-border);
    cursor: pointer;
    transition: padding 0.15s ease;
  }

  .item-list li:first-child {
    border-top: 1px solid var(--wc-border);
  }

  .item-name {
    display: block;
    font-family: var(--wc-font-body);
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: var(--wc-item-name-size);
    color: var(--wc-muted);
    text-shadow: 0.3px 0 0 currentColor, -0.3px 0 0 currentColor;
    transition: color 0.15s ease, font-size 0.15s ease;
  }

  .item-type {
    display: block;
    margin-top: 2px;
    font-size: var(--wc-item-type-size);
    letter-spacing: var(--wc-label-tracking);
    text-transform: uppercase;
    color: var(--wc-muted);
    opacity: 0.7;
    transition: color 0.15s ease;
  }

  .item-list li:hover .item-name,
  .item-list li.active .item-name {
    color: var(--wc-fg);
    font-size: var(--wc-item-name-size-active);
  }

  .item-list li:hover .item-type,
  .item-list li.active .item-type {
    color: var(--wc-fg);
  }

  .view-all {
    display: inline-block;
    font-size: 13px;
    letter-spacing: var(--wc-label-tracking);
    text-transform: uppercase;
    color: var(--wc-fg);
    text-decoration: none;
  }

  .view-all:hover { opacity: 0.7; }

  /* ---- Preview column ---- */
  .preview-col {
    flex: 1 1 320px;
    min-width: 0;
  }

  .preview-image {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    background: var(--wc-panel);
    border: 1px solid var(--wc-border);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-image img,
  .preview-image video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }

  .preview-image .state-message {
    font-size: 13px;
    color: var(--wc-muted);
  }

  .preview-image img.scroll-pan {
    object-fit: cover;
    object-position: 50% 0%;
  }

  /* ---- Meta column ---- */
  .meta-col {
    flex: 0 0 var(--wc-meta-width);
    min-width: 0;
  }

  .badge {
    font-family: var(--wc-font-heading);
    font-weight: 700;
    font-size: var(--wc-badge-size);
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px var(--wc-fg);
    margin: 0 0 20px;
  }

  .meta-block {
    margin-bottom: 20px;
  }

  .meta-block h4 {
    margin: 0 0 6px;
    font-size: 12px;
    letter-spacing: var(--wc-label-tracking);
    text-transform: uppercase;
    color: var(--wc-accent);
    font-weight: 700;
  }

  .meta-block p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: var(--wc-fg);
  }

  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .pill {
    display: inline-block;
    background: var(--wc-pill-bg, #d9d9d9);
    color: var(--wc-pill-fg, #0a0a0a);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .meta-link-block {
    margin-top: 48px;
  }

  .meta-link-block[hidden] {
    display: none;
  }

  .website-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: var(--wc-fg);
    color: #0a0a0a;
    font-family: var(--wc-font-heading);
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    text-decoration: none;
    border-radius: 4px;
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .website-button:hover {
    transform: translateY(-2px);
    background: var(--wc-accent, #ffffff);
  }

  @media (max-width: 860px) {
    .layout {
      flex-direction: column;
    }

    .list-col,
    .meta-col {
      flex-basis: auto;
      width: 100%;
    }
  }
</style>

<div class="layout">
  <div class="list-col">
    <h2 part="title"></h2>
    <ul class="item-list"></ul>
    <a class="view-all" href="#" target="_blank" rel="noopener"></a>
  </div>

  <div class="preview-col">
    <div class="preview-image">
      <div class="state-message">Loading…</div>
    </div>
  </div>

  <div class="meta-col">
    <div class="badge"></div>
    <div class="meta-block">
      <h4>Role</h4>
      <p class="meta-role"></p>
    </div>
    <div class="meta-block">
      <h4>Description</h4>
      <p class="meta-description"></p>
    </div>
    <div class="meta-block">
      <h4>Stack</h4>
      <div class="meta-stack pill-list"></div>
    </div>
    <div class="meta-block">
      <h4>Implementations</h4>
      <div class="meta-implementations pill-list"></div>
    </div>

    <div class="meta-link-block">
      <a class="website-button" href="#" target="_blank" rel="noopener">Go to Website →</a>
    </div>
  </div>
</div>
`;

class WorkShowcase extends HTMLElement {
  static get observedAttributes() {
    return ["api-endpoint", "title", "view-all-text", "view-all-url"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(WORK_TEMPLATE.content.cloneNode(true));
    this._items = [];
    this._index = 0;
  }

  connectedCallback() {
    this._render();
    this._loadData();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get apiEndpoint() { return this.getAttribute("api-endpoint"); }
  get titleText() { return this.getAttribute("title") || "My Work"; }
  get viewAllText() { return this.getAttribute("view-all-text") || ""; }
  get viewAllUrl() { return this.getAttribute("view-all-url") || ""; }

  _render() {
    const root = this.shadowRoot;
    root.querySelector("h2").textContent = this.titleText;

    const link = root.querySelector(".view-all");
    if (this.viewAllText && this.viewAllUrl) {
      link.hidden = false;
      link.textContent = this.viewAllText + " →";
      link.href = this.viewAllUrl;
    } else {
      link.hidden = true;
    }
  }

  async _loadData() {
    const previewImage = this.shadowRoot.querySelector(".preview-image");

    if (!this.apiEndpoint) {
      previewImage.innerHTML = `<div class="state-message">Set api-endpoint to load work items.</div>`;
      return;
    }

    previewImage.innerHTML = `<div class="state-message">Loading…</div>`;

    try {
      const res = await fetch(this.apiEndpoint);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();

      this._items = Array.isArray(data.items) ? data.items : [];

      if (this._items.length === 0) {
        previewImage.innerHTML = `<div class="state-message">No work items yet.</div>`;
        return;
      }

      this._renderList();
      this._showItem(0);
    } catch (err) {
      console.error("[work-showcase] failed to load:", err);
      previewImage.innerHTML = `<div class="state-message">Couldn't load work items right now.</div>`;
    }
  }

  _renderList() {
    const listEl = this.shadowRoot.querySelector(".item-list");

    listEl.innerHTML = this._items
      .map(
        (item, i) => `
        <li data-index="${i}">
          <span class="item-name">${window.TextHelper.escapeText(item.name || "")}</span>
          <span class="item-type">${window.TextHelper.escapeText(item.type || "")}</span>
        </li>
      `
      )
      .join("");

    listEl.querySelectorAll("li").forEach((li) => {
      const i = Number(li.dataset.index);
      li.addEventListener("click", () => this._showItem(i));
    });
  }

  _showItem(index) {
    const items = this._items;
    if (items.length === 0) return;

    this._index = Math.max(0, Math.min(index, items.length - 1));
    const item = items[this._index];

    const root = this.shadowRoot;
    const listEl = root.querySelector(".item-list");
    const previewImage = root.querySelector(".preview-image");
    const badgeEl = root.querySelector(".badge");
    const roleEl = root.querySelector(".meta-role");
    const descriptionEl = root.querySelector(".meta-description");
    const stackEl = root.querySelector(".meta-stack");
    const implEl = root.querySelector(".meta-implementations");

    listEl.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", Number(li.dataset.index) === this._index);
    });

    previewImage.innerHTML = this._buildPreviewMedia(item);
    this._applyScrollMode(previewImage);

    badgeEl.textContent = String(this._index + 1).padStart(2, "0");
    roleEl.textContent = item.role || "";
    descriptionEl.textContent = item.description || "";
    stackEl.innerHTML = this._buildPills(item.stack);
    implEl.innerHTML = this._buildPills(item.implementations);

    const linkBlock = root.querySelector(".meta-link-block");
    const websiteButton = root.querySelector(".website-button");
    if (item.websiteUrl) {
      websiteButton.href = item.websiteUrl;
      linkBlock.hidden = false;
    } else {
      linkBlock.hidden = true;
    }
  }

  _buildPills(value) {
    const list = this._toList(value);
    if (list.length === 0) return "";

    return list
      .map((tag) => `<span class="pill">${window.TextHelper.escapeText(tag)}</span>`)
      .join("");
  }

  _toList(value) {
    if (Array.isArray(value)) {
      return value.map((v) => String(v).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
      return value
        .split("/")
        .map((v) => v.trim())
        .filter(Boolean);
    }
    return [];
  }

  _applyScrollMode(container) {
    const img = container.querySelector("img");
    if (!img) return;

    const apply = () => {
      const ratio = img.naturalHeight / img.naturalWidth;
      if (!ratio || ratio < 1.5) return;

      img.classList.add("scroll-pan");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const boxRatio = container.clientHeight / container.clientWidth || 0.625;
      const viewports = ratio / boxRatio;
      const swipes = Math.min(Math.max(Math.ceil((viewports - 1) / 0.85), 2), 12);

      const hold = 1200;
      const swipe = 800;
      const back = 900;
      const flick = "cubic-bezier(0.16, 1, 0.3, 1)";
      const glide = "cubic-bezier(0.65, 0, 0.35, 1)";

      const frames = [];
      let t = 0;
      for (let i = 0; i <= swipes; i++) {
        const pos = (i / swipes) * 100;
        frames.push({ t, pos, easing: "linear" });
        t += hold;
        if (i < swipes) {
          frames.push({ t, pos, easing: flick });
          t += swipe;
        }
      }
      frames.push({ t, pos: 100, easing: glide });
      t += back;
      frames.push({ t, pos: 0, easing: "linear" });

      const total = t;
      const anim = img.animate(
        frames.map((f) => ({
          objectPosition: `50% ${f.pos}%`,
          easing: f.easing,
          offset: f.t / total,
        })),
        { duration: total, iterations: Infinity }
      );

      img.addEventListener("mouseenter", () => anim.pause());
      img.addEventListener("mouseleave", () => anim.play());
    };

    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener("load", apply, { once: true });
  }

  _buildPreviewMedia(item) {
    const featured = item.preview && item.preview.featured;

    if (!featured) {
      return `<div class="state-message">No preview available</div>`;
    }

    return this._mediaTag(featured, item.name);
  }

  _mediaTag(src, altLabel, autoplay = true) {
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
    const safeSrc = window.TextHelper.escapeAttr(src);
    const safeAlt = window.TextHelper.escapeAttr(altLabel || "");

    if (isVideo) {
      const autoplayAttrs = autoplay ? "autoplay muted loop playsinline" : "muted loop playsinline";
      return `<video src="${safeSrc}" ${autoplayAttrs} aria-label="${safeAlt}"></video>`;
    }

    // .gif, .png, .jpg, etc. — plain <img> autoplays gifs natively
    return `<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" />`;
  }
}

customElements.define("work-showcase", WorkShowcase);