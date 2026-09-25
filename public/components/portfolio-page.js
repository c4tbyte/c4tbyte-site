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

    position: relative;
    display: block;
    background: var(--pp-bg);
    color: var(--pp-fg);
    font-family: var(--pp-font-body);
    padding: var(--pp-padding);
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  .page-title {
    font-family: var(--pp-font-heading);
    font-weight: 700;
    font-size: clamp(40px, 6vw, 72px);
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    text-align: right;
    margin: 0 0 40px;
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
    padding: 8px 0;
    cursor: pointer;
  }

  .item-name {
    display: block;
    font-family: var(--pp-font-heading);
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    font-size: 15px;
    color: var(--pp-muted);
    transition: color 0.15s ease;
  }

  .item-type {
    display: block;
    margin-top: 2px;
    font-size: 10px;
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    color: var(--pp-muted);
    opacity: 0.7;
  }

  .item-list li:hover .item-name,
  .item-list li.active .item-name {
    color: var(--pp-fg);
  }

  .item-list li.active .item-type {
    color: var(--pp-fg);
  }

  .detail-col {
    flex: 1 1 auto;
    min-width: 0;
  }

  .detail-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
  }

  .detail-name {
    font-family: var(--pp-font-heading);
    font-weight: 700;
    font-size: clamp(24px, 3vw, 34px);
    letter-spacing: 0.01em;
    text-transform: uppercase;
    margin: 0;
  }

  .detail-type {
    font-size: 11px;
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    color: var(--pp-muted);
    white-space: nowrap;
  }

  .gallery {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 10;
    background: var(--pp-panel);
    border: 1px solid var(--pp-border);
    overflow: hidden;
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
    align-items: center;
    justify-content: space-between;
    gap: 16px;
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
    transition: opacity 0.15s ease;
  }

  .thumbnail img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .thumbnail.active { opacity: 1; }

  .autoplay-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    letter-spacing: var(--pp-label-tracking);
    text-transform: uppercase;
    color: var(--pp-muted);
    flex-shrink: 0;
  }

  .switch {
    position: relative;
    width: 36px;
    height: 20px;
    background: var(--pp-panel);
    border: 1px solid var(--pp-border);
    border-radius: 999px;
    cursor: pointer;
  }

  .switch::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background: var(--pp-muted);
    border-radius: 50%;
    transition: transform 0.2s ease, background 0.2s ease;
  }

  .switch.on::after {
    transform: translateX(16px);
    background: var(--pp-fg);
  }

  .lower {
    display: flex;
    gap: 40px;
    margin-top: 28px;
    align-items: flex-start;
  }

  .description {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #cfcfcf;
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

  @media (max-width: 860px) {
    .layout { flex-direction: column; }
    .list-col { max-height: none; flex-basis: auto; width: 100%; }
    .lower { flex-direction: column; }
  }
</style>

<h1 class="page-title" part="page-title"></h1>
<div class="layout">
  <div class="list-col">
    <ul class="item-list"></ul>
  </div>

  <div class="detail-col">
    <div class="detail-header">
      <h2 class="detail-name"></h2>
      <span class="detail-type"></span>
    </div>

    <div class="gallery">
      <button class="gallery-arrow prev" aria-label="Previous image" hidden>&#8249;</button>
      <div class="gallery-image"><div class="state-message">Loading…</div></div>
      <button class="gallery-arrow next" aria-label="Next image" hidden>&#8250;</button>
    </div>

    <div class="gallery-controls">
      <div class="thumbnails"></div>
      <div class="autoplay-toggle">
        <span>Autoplay</span>
        <div class="switch" role="switch" aria-checked="false"></div>
      </div>
    </div>

    <div class="lower">
      <p class="description"></p>
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
    this._autoplay = false;
    this._autoplayTimer = null;
  }

  connectedCallback() {
    this._render();
    this._setupAutoplayToggle();
    this._loadData();
  }

  disconnectedCallback() {
    this._stopAutoplay();
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get apiEndpoint() { return this.getAttribute("api-endpoint"); }
  get pageTitleText() { return this.getAttribute("page-title") || "Portfolio"; }

  _render() {
    this.shadowRoot.querySelector(".page-title").textContent = this.pageTitleText;
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

    root.querySelector(".detail-name").textContent = item.name || "";
    root.querySelector(".detail-type").textContent = item.type || "";
    root.querySelector(".description").textContent = item.description || "";
    root.querySelector(".meta-role").textContent = item.role || "";
    root.querySelector(".meta-stack").innerHTML = this._buildPills(item.stack);
    root.querySelector(".meta-implementations").innerHTML = this._buildPills(item.implementations);

    this._renderThumbnails();
    this._renderGalleryImage();
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

  _setupAutoplayToggle() {
    const toggle = this.shadowRoot.querySelector(".switch");
    toggle.addEventListener("click", () => {
      this._autoplay = !this._autoplay;
      toggle.classList.toggle("on", this._autoplay);
      toggle.setAttribute("aria-checked", String(this._autoplay));
      if (this._autoplay) this._startAutoplay();
      else this._stopAutoplay();
    });
  }

  _startAutoplay() {
    this._stopAutoplay();
    this._autoplayTimer = setInterval(() => this._stepGallery(1), 3000);
  }

  _stopAutoplay() {
    if (this._autoplayTimer) {
      clearInterval(this._autoplayTimer);
      this._autoplayTimer = null;
    }
  }
}

customElements.define("portfolio-page", PortfolioPage);