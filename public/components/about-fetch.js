const FIELD_SECTIONS = [
  {
    fields: [
      { label: "OS", value: "Arch Linux" },
      { label: "Founded", value: "" },
      { label: "Host", value: "Quanta Manufacturing" },
      { label: "Role", value: "Test Engineer (AI/HPC Infrastructure) & Freelance Developer" },
      { label: "System", value: "Cooked ThinkPad T480" },
    ],
  },
  {
    fields: [
      { label: "Packages.AI-HPC", value: "NVIDIA GB200/GB300 NVL72, HGX, NVLink/NVSwitch, Fabric Manager, ConnectX-8", wrap: true },
      { label: "Packages.Networking", value: "Linux, PXE, DHCP, TCP/IP, VLANs, Ethernet switching, SSH, BMC/HMC, IPMI, Redfish, OpenBMC", wrap: true },
      { label: "Packages.Automation", value: "Ansible, FastAPI, REST APIs, Docker, Git/GitHub, Claude, Codex", wrap: true },
    ],
  },
  {
    fields: [
      { label: "Languages.Programming", value: "Python, Bash, PowerShell, SQL, JavaScript, React" },
      { label: "Languages.Real", value: "English, Spanish, Russian kinda" },
    ],
  },
  {
    fields: [
      { label: "Hobbies.Software", value: "Self-hosting, Linux ricing, digital paranoia, bootleg VPN provider", wrap: true },
      { label: "Hobbies.Technical", value: "Homelab, console modding & repair, VLANing my entire house", wrap: true },
      { label: "Hobbies.Other", value: "Going to shows & festivals, disappearing into the woods alone for days, trading memes", wrap: true },
    ],
  },
];

const AF_TEMPLATE = document.createElement("template");
AF_TEMPLATE.innerHTML = `
<style>
  :host {
    --af-bg: transparent;
    --af-fg: #ffffff;
    --af-muted: #9a9a9a;
    --af-border: var(--border-color, #737373);
    --af-label-color: #33ff33;
    --af-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --af-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --af-font-mono: 'IBM Plex Mono', 'Courier New', monospace;
    --af-label-tracking: 0.08em;
    --af-padding: 28px;
    --af-ascii-size: 5px;

    position: relative;
    display: block;
    background: var(--af-bg);
    color: var(--af-fg);
    font-family: var(--af-font-body);
    padding: var(--af-padding);
    border-bottom: 1px solid var(--af-border);
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  .header {
    text-align: center;
    margin-bottom: 24px;
  }

  h2 {
    margin: 0 0 8px;
    font-family: var(--af-font-heading);
    font-size: 32px;
    font-weight: 700;
    letter-spacing: var(--af-label-tracking);
    text-transform: uppercase;
  }

  .subtext {
    margin: 0;
    font-family: var(--af-font-body);
    font-size: 18px;
    letter-spacing: 0.08em;
    color: #cfcfcf;
  }

  .fetch {
    display: flex;
    align-items: center;
    gap: 32px;
    flex-wrap: nowrap;
    justify-content: center;
    width: fit-content;
    margin: 0 auto;
  }

  .ascii {
    font-family: var(--af-font-mono);
    font-size: var(--af-ascii-size);
    line-height: 1;
    white-space: pre;
    margin: 0;
    flex-shrink: 0;
    background: linear-gradient(to bottom, #66d66a, #1f4d1f);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .info {
    font-family: var(--af-font-mono);
    font-size: 12px;
    line-height: 1.7;
  }

  .whoami {
    color: var(--af-label-color);
    font-weight: 700;
  }

  .rule {
    color: var(--af-fg);
    font-weight: 700;
  }

  .field {
    white-space: nowrap;
  }

  .field.wrap {
    white-space: normal;
    max-width: 480px;
  }

  .label {
    color: var(--af-label-color);
    font-weight: 700;
  }

  .value {
    color: var(--af-fg);
  }

  .section-gap {
    height: 14px;
  }

  @media (max-width: 720px) {
    .fetch {
      flex-direction: column;
      align-items: center;
    }

    .info {
      font-size: 13px;
    }
  }
</style>

<div class="header">
  <h2 part="title"></h2>
  <p class="subtext" part="subtext"></p>
</div>
<div class="fetch">
  <pre class="ascii"></pre>
  <div class="info"></div>
</div>
`;

class AboutFetch extends HTMLElement {
  static get observedAttributes() {
    return ["title", "subtext", "ascii-src", "founded-date", "whoami"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(AF_TEMPLATE.content.cloneNode(true));
    this._uptimeInterval = null;
  }

  connectedCallback() {
    this._render();
    this._loadAscii();
    this._buildInfo();
    this._startUptime();

    this._resizeHandler = () => {
      const asciiEl = this.shadowRoot.querySelector(".ascii");
      if (asciiEl && asciiEl.textContent) this._syncAsciiSize(asciiEl);
    };
    window.addEventListener("resize", this._resizeHandler);
  }

  disconnectedCallback() {
    if (this._uptimeInterval) clearInterval(this._uptimeInterval);
    if (this._resizeHandler) window.removeEventListener("resize", this._resizeHandler);
  }

  attributeChangedCallback() {
    if (this.isConnected) this._render();
  }

  get titleText() { return this.getAttribute("title") || "About"; }
  get subtextValue() { return this.getAttribute("subtext") || ""; }
  get asciiSrc() { return this.getAttribute("ascii-src") || "/images/ascii/c4tbyte.txt"; }
  get foundedDate() { return this.getAttribute("founded-date") || ""; }
  get whoamiText() { return this.getAttribute("whoami") || "me@c4tbyte"; }

  _render() {
    const root = this.shadowRoot;
    root.querySelector("h2").textContent = this.titleText;
    root.querySelector(".subtext").textContent = this.subtextValue;
  }

  async _loadAscii() {
    const asciiEl = this.shadowRoot.querySelector(".ascii");
    try {
      const res = await fetch(this.asciiSrc);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      asciiEl.textContent = await res.text();
      this._syncAsciiSize(asciiEl);
    } catch (err) {
      console.error("[about-fetch] failed to load ASCII art:", err);
      asciiEl.textContent = "";
    }
  }

  _syncAsciiSize(asciiEl) {
    const infoEl = this.shadowRoot.querySelector(".info");
    const lineCount = (asciiEl.textContent.match(/\n/g) || []).length + 1;
    const infoHeight = infoEl.offsetHeight;

    if (lineCount > 0 && infoHeight > 0) {
      const fontSize = infoHeight / lineCount;
      asciiEl.style.fontSize = `${fontSize}px`;
    }
  }

  _buildInfo() {
    const infoEl = this.shadowRoot.querySelector(".info");
    const dashCount = this.whoamiText.length;
    const dashes = "-".repeat(dashCount);

    let html = `<div class="whoami">${this._escape(this.whoamiText)}</div>`;
    html += `<div class="rule">${dashes}</div>`;

    FIELD_SECTIONS.forEach((section, sectionIndex) => {
      section.fields.forEach((field) => {
        if (field.label === "Founded") {
          html += `<div class="field"><span class="label">Uptime:</span> <span class="value" id="af-uptime">Loading…</span></div>`;
          return;
        }
        html += `<div class="field${field.wrap ? " wrap" : ""}"><span class="label">${this._escape(field.label)}:</span> <span class="value">${this._escape(field.value)}</span></div>`;
      });
      if (sectionIndex < FIELD_SECTIONS.length - 1) {
        html += `<div class="section-gap"></div>`;
      }
    });

    infoEl.innerHTML = html;
  }

  _escape(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  _startUptime() {
    if (!this.foundedDate) {
      const uptimeEl = this.shadowRoot.querySelector("#af-uptime");
      if (uptimeEl) uptimeEl.textContent = "[Set founded-date attribute]";
      return;
    }

    const founded = new Date(this.foundedDate);
    if (isNaN(founded.getTime())) {
      const uptimeEl = this.shadowRoot.querySelector("#af-uptime");
      if (uptimeEl) uptimeEl.textContent = "[Invalid founded-date]";
      return;
    }

    const update = () => {
      const uptimeEl = this.shadowRoot.querySelector("#af-uptime");
      if (!uptimeEl) return;

      const now = new Date();
      const diff = now - founded;

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      uptimeEl.textContent = `${years}y ${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    update();
    this._uptimeInterval = setInterval(update, 1000);
  }
}

customElements.define("about-fetch", AboutFetch);