const PP_TEMPLATE = document.createElement("template");
PP_TEMPLATE.innerHTML = `
<style>
  :host {
    --pp-bg: transparent;
    --pp-fg: #ffffff;
    --pp-muted: #6b6b6b;
    --pp-panel: #131313;
    --pp-border: var(--border-color, #737373);
    --pp-accent: #ffffff;
    --pp-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --pp-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --pp-label-tracking: 0.08em;
    --pp-padding: 34px;
    --pp-list-width: 260px;
    --pp-meta-width: 240px;
    --pp-item-name-size: 20px;
    --pp-item-name-size-active: 26px;

    position: relative;
    display: block;
    background: var(--pp-bg);
    color: var(--pp-fg);
    font-family: var(--pp-font-body);
    padding: var(--pp-padding);
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  /* ---- Fixed full-viewport backdrop, behind everything ---- */
  .backdrop-layer {
    position: fixed;
    inset: 0;
    z-index: -2;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 0.6s ease, background-image 0.6s ease;
    pointer-events: none;
  }

  .backdrop-layer.visible {
    opacity: 1;
  }

  .backdrop-tint {
    position: fixed;
    inset: 0;
    z-index: -1;
    background: var(--pp-tint-color, rgba(10, 10, 10, 0.7));
    transition: background 0.6s ease;
    pointer-events: none;
  }

  .page-title-block {
    text-align: right;
    margin-bottom: 28px;
  }

  .page-title {
    font-family: var(--pp-font-heading);
    font-weight: 700;
    font-size: clamp(32px, 5vw, 56px);
    letter-spacing: 0.01em;
    text-transform: uppercase;
    margin: 0;
    transition: color 0.4s ease;
  }

  .page-subtitle {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    color: var(--pp-muted);
  }

  .layout {
    display: flex;
    gap: 48px;
    align-items: flex-start;
  }

  .list-col {
    flex: 0 0 var(--pp-list-width);
    min-width: 0;
    max-height: 80vh;
    overflow-y: auto;
  }

  .item-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .item-list li {
    padding: 10px 0;
    border-bottom: 1px solid var(--pp-border);
    cursor: pointer;
    transition: padding 0.15s ease;
  }

  .item-list li:first-child {
    border-top: 1px solid var(--pp-border);
  }

  .item-name {
    display: block;
    font-family: var(--pp-font-body);
    font-weight: 400;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-size: var(--pp-item-name-size);
    color: var(--pp-muted);
    text-shadow: 0.3px 0 0 currentColor, -0.3px 0 0 currentColor;
    transition: color 0.15s ease, font-size 0.15s ease;
  }

  .item-type {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    color: var(--pp-muted);
    opacity: 0.7;
    transition: color 0.15s ease;
  }

  .item-list li:hover .item-name,
  .item-list li.active .item-name {
    color: var(--pp-fg);
    font-size: var(--pp-item-name-size-active);
  }

  .item-list li:hover .item-type,
  .item-list li.active .item-type {
    color: var(--pp-fg);
  }

  .detail-col {
    flex: 1 1 auto;
    min-width: 0;
  }

  .preview-row {
    display: flex;
    gap: 40px;
    align-items: flex-start;
  }

  .gallery-wrap {
    flex: 1 1 auto;
    min-width: 0;
  }

  .gallery {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    background: var(--pp-panel);
    border: 1px solid var(--pp-gallery-border, var(--pp-border));
    overflow: hidden;
    transition: border-color 0.4s ease;
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .gallery-image img,
  .gallery-image video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .gallery-image .state-message {
    font-size: 13px;
    color: var(--pp-muted);
  }

  .gallery-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    background: rgba(10, 10, 10, 0.7);
    border: 1px solid var(--pp-border);
    color: var(--pp-fg);
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .gallery-arrow:hover { background: rgba(10, 10, 10, 0.9); }
  .gallery-arrow.prev { left: 12px; }
  .gallery-arrow.next { right: 12px; }
  .gallery-arrow[hidden] { display: none; }

  .gallery-controls {
    display: flex;
    justify-content: center;
    margin-top: 14px;
  }

  .thumbnails {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .thumbnail {
    width: 52px;
    height: 40px;
    border: 1px solid var(--pp-border);
    background: var(--pp-panel);
    cursor: pointer;
    overflow: hidden;
    opacity: 0.55;
    transition: opacity 0.15s ease, border-color 0.4s ease;
  }

  .thumbnail img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .thumbnail.active {
    opacity: 1;
    border-color: var(--pp-accent);
  }

  .meta-col {
    flex: 0 0 var(--pp-meta-width);
    min-width: 0;
  }

  .meta-block {
    margin-bottom: 18px;
  }

  .meta-block h4 {
    margin: 0 0 6px;
    font-size: 12px;
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    color: var(--pp-accent);
    font-weight: 700;
    transition: color 0.4s ease;
  }

  .meta-block p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
  }

  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .pill {
    display: inline-block;
    background: var(--pp-pill-bg, #d9d9d9);
    color: var(--pp-pill-fg, #0a0a0a);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;
  }

  /* ---- Markdown-rendered content block ---- */
  .description-block {
    margin-top: 32px;
    max-width: 760px;
    font-size: 14px;
    line-height: 1.8;
    color: #cfcfcf;
  }

  .description-block h1,
  .description-block h2,
  .description-block h3,
  .description-block h4 {
    font-family: var(--pp-font-heading);
    color: var(--pp-fg);
    text-transform: uppercase;
    letter-spacing: 0.02em;
    margin: 1.4em 0 0.5em;
  }

  .description-block h1:first-child,
  .description-block h2:first-child,
  .description-block h3:first-child {
    margin-top: 0;
  }

  .description-block h1 { font-size: 22px; }
  .description-block h2 { font-size: 18px; }
  .description-block h3 { font-size: 15px; }

  .description-block p {
    margin: 0 0 1em;
  }

  .description-block ul,
  .description-block ol {
    margin: 0 0 1em;
    padding-left: 1.4em;
  }

  .description-block li {
    margin-bottom: 0.4em;
  }

  .description-block a {
    color: var(--pp-accent);
    text-decoration: underline;
  }

  .description-block strong {
    color: var(--pp-fg);
  }

  .description-block code {
    font-family: var(--af-font-mono, 'IBM Plex Mono', monospace);
    background: var(--pp-panel);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
  }

  .description-block blockquote {
    margin: 0 0 1em;
    padding-left: 14px;
    border-left: 2px solid var(--pp-border);
    color: var(--pp-muted);
  }

  .description-block hr {
    border: none;
    border-top: 1px solid var(--pp-border);
    margin: 1.5em 0;
  }

  @media (max-width: 860px) {
    .layout { flex-direction: column; }
    .list-col { max-height: none; flex-basis: auto; width: 100%; }
    .preview-row { flex-direction: column; }
    .page-title-block { text-align: left; }
  }
</style>

<div class="backdrop-layer" part="backdrop"></div>
<div class="backdrop-tint" part="backdrop-tint"></div>

<div class="page-title-block">
  <h1 class="page-title" part="page-title"></h1>
  <span class="page-subtitle" part="page-subtitle"></span>
</div>
<div class="layout">
  <div class="list-col">
    <ul class="item-list"></ul>
  </div>

  <div class="detail-col">
    <div class="preview-row">
      <div class="gallery-wrap">
        <div class="gallery">
          <button class="gallery-arrow prev" aria-label="Previous image" hidden>&#8249;</button>
          <div class="gallery-image"><div class="state-message">Loading…</div></div>
          <button class="gallery-arrow next" aria-label="Next image" hidden>&#8250;</button>
        </div>
        <div class="gallery-controls">
          <div class="thumbnails"></div>
        </div>
      </div>

      <div class="meta-col">
        <div class="meta-block">
          <h4>Role</h4>
          <p class="meta-role"></p>
        </div>
        <div class="meta-block">
          <h4>Stack</h4>
          <div class="meta-stack pill-list"></div>
        </div>
        <div class="meta-block">
          <h4>Implementations</h4>
          <div class="meta-implementations pill-list"></div>
        </div>
      </div>
    </div>

    <div class="description-block"></div>
  </div>
</div>
`;

class PortfolioPage extends HTMLElement {
  static get observedAttributes() {
    return ["api-endpoint", "page-title"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(PP_TEMPLATE.content.cloneNode(true));
    this._items = [];
    this._index = 0;
    this._galleryIndex = 0;
  }

  connectedCallback() {
    this._render();
    this._loadData();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get apiEndpoint() { return this.getAttribute("api-endpoint"); }
  get pageTitleText() { return this.getAttribute("page-title") || "Portfolio"; }

  _render() {
    this.shadowRoot.querySelector(".page-title").textContent = this.pageTitleText;
    this.shadowRoot.querySelector(".page-subtitle").textContent = "";
  }

  async _loadData() {
    const galleryImage = this.shadowRoot.querySelector(".gallery-image");

    if (!this.apiEndpoint) {
      galleryImage.innerHTML = `<div class="state-message">Set api-endpoint to load work items.</div>`;
      return;
    }

    galleryImage.innerHTML = `<div class="state-message">Loading…</div>`;

    try {
      const res = await fetch(this.apiEndpoint);
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      const data = await res.json();

      this._items = Array.isArray(data.items) ? data.items : [];

      if (this._items.length === 0) {
        galleryImage.innerHTML = `<div class="state-message">No work items yet.</div>`;
        return;
      }

      this._renderList();
      this._showItem(0);
    } catch (err) {
      console.error("[portfolio-page] failed to load:", err);
      galleryImage.innerHTML = `<div class="state-message">Couldn't load work items right now.</div>`;
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
    this._galleryIndex = 0;
    const item = items[this._index];

    const root = this.shadowRoot;

    root.querySelectorAll(".item-list li").forEach((li) => {
      li.classList.toggle("active", Number(li.dataset.index) === this._index);
    });

    root.querySelector(".page-title").textContent = item.name || "";
    root.querySelector(".page-subtitle").textContent = item.type || "";
    root.querySelector(".meta-role").textContent = item.role || "";
    root.querySelector(".meta-stack").innerHTML = this._buildPills(item.stack);
    root.querySelector(".meta-implementations").innerHTML = this._buildPills(item.implementations);

    this._renderMarkdown(item);

    const accent = item.color && /^#[0-9a-f]{3,8}$/i.test(item.color) ? item.color : "";
    this.style.setProperty("--pp-accent", accent || "#ffffff");
    this.style.setProperty("--pp-gallery-border", accent || "");
    root.querySelector(".page-title").style.color = accent || "";

    this._setTint(item.tintColor);
    this._setBackdrop(item.preview && item.preview.backdrop);

    this._renderThumbnails();
    this._renderGalleryImage();
  }

  _renderMarkdown(item) {
    const el = this.shadowRoot.querySelector(".description-block");
    const source = item.content || item.description || "";

    if (!source) {
      el.innerHTML = "";
      return;
    }

    if (window.marked && typeof window.marked.parse === "function") {
      el.innerHTML = window.marked.parse(source);
    } else {
      // Fallback if marked hasn't loaded yet: show as plain text rather than raw markdown syntax
      el.textContent = source;
    }
  }

  _setTint(tintColor) {
    const isValidColor = tintColor && /^#[0-9a-f]{3,8}$/i.test(tintColor);
    if (isValidColor) {
      // Convert hex to rgba with a fixed readability-friendly alpha
      const hex = tintColor.replace("#", "");
      const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
      const r = parseInt(full.substring(0, 2), 16);
      const g = parseInt(full.substring(2, 4), 16);
      const b = parseInt(full.substring(4, 6), 16);
      this.style.setProperty("--pp-tint-color", `rgba(${r}, ${g}, ${b}, 0.55)`);
    } else {
      this.style.setProperty("--pp-tint-color", "rgba(10, 10, 10, 0.7)");
    }
  }

  _setBackdrop(url) {
    const layer = this.shadowRoot.querySelector(".backdrop-layer");
    if (!url) {
      layer.classList.remove("visible");
      return;
    }
    const safeUrl = window.TextHelper.escapeAttr(url);
    layer.style.backgroundImage = `url("${safeUrl}")`;
    layer.classList.add("visible");
  }

  _getGallery() {
    const item = this._items[this._index];
    return (item && Array.isArray(item.gallery)) ? item.gallery : [];
  }

  _renderThumbnails() {
    const thumbsEl = this.shadowRoot.querySelector(".thumbnails");
    const gallery = this._getGallery();

    thumbsEl.innerHTML = gallery
      .map(
        (src, i) => `
        <div class="thumbnail${i === this._galleryIndex ? " active" : ""}" data-index="${i}">
          <img src="${window.TextHelper.escapeAttr(src)}" alt="" loading="lazy" />
        </div>
      `
      )
      .join("");

    thumbsEl.querySelectorAll(".thumbnail").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        this._galleryIndex = Number(thumb.dataset.index);
        this._renderGalleryImage();
        this._renderThumbnails();
      });
    });
  }

  _renderGalleryImage() {
    const root = this.shadowRoot;
    const galleryImage = root.querySelector(".gallery-image");
    const prevBtn = root.querySelector(".gallery-arrow.prev");
    const nextBtn = root.querySelector(".gallery-arrow.next");
    const gallery = this._getGallery();

    if (gallery.length === 0) {
      galleryImage.innerHTML = `<div class="state-message">No images available</div>`;
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }

    const src = gallery[this._galleryIndex];
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
    const safeSrc = window.TextHelper.escapeAttr(src);

    galleryImage.innerHTML = isVideo
      ? `<video src="${safeSrc}" autoplay muted loop playsinline></video>`
      : `<img src="${safeSrc}" alt="" />`;

    const showArrows = gallery.length > 1;
    prevBtn.hidden = !showArrows;
    nextBtn.hidden = !showArrows;

    prevBtn.onclick = () => this._stepGallery(-1);
    nextBtn.onclick = () => this._stepGallery(1);
  }

  _stepGallery(delta) {
    const gallery = this._getGallery();
    if (gallery.length === 0) return;
    this._galleryIndex = (this._galleryIndex + delta + gallery.length) % gallery.length;
    this._renderGalleryImage();
    this._renderThumbnails();
  }

  _buildPills(value) {
    const list = this._toList(value);
    if (list.length === 0) return "";
    return list
      .map((tag) => `<span class="pill">${window.TextHelper.escapeText(tag)}</span>`)
      .join("");
  }

  _toList(value) {
    if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
    if (typeof value === "string") {
      return value.split("/").map((v) => v.trim()).filter(Boolean);
    }
    return [];
  }
}

customElements.define("portfolio-page", PortfolioPage);