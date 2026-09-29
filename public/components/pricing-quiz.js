const RATE_TIERS = {
  scene: { label: "Scene & Nonprofit" },
  standard: { label: "Standard" },
};

// Each service has a base price (by tier) and a set of optional extras.
// Extras can be a flat add-on or a set of choices (radio-style within the extra).
const SERVICES = {
  website: {
    label: "Custom Web Design & Development",
    base: { scene: 500, standard: 1200 },
    extras: [
      {
        id: "pages",
        label: "Additional pages beyond the 3 included",
        type: "number",
        unit: { scene: 50, standard: 125 },
        suffix: "page(s)",
      },
      {
        id: "interactive",
        label: "Custom interactive components",
        type: "select",
        options: [
          { label: "None", value: { scene: 0, standard: 0 } },
          { label: "Simple (hover effects, transitions)", value: { scene: 20, standard: 40 } },
          { label: "Moderate (carousels, filters, interactive forms)", value: { scene: 50, standard: 100 } },
          { label: "Complex (physics, multi-step, custom data)", value: { scene: 150, standard: 300 } },
        ],
      },
      {
        id: "content-mgmt",
        label: "Content management",
        type: "select",
        options: [
          { label: "Self-managed (included, no extra cost)", value: { scene: 0, standard: 0 } },
          { label: "Backline dashboard (bundled setup)", value: { scene: 40, standard: 100 } },
        ],
      },
      {
        id: "ecommerce",
        label: "E-commerce / merch",
        type: "select",
        options: [
          { label: "None", value: { scene: 0, standard: 0 } },
          { label: "Display only (links out to your store)", value: { scene: 75, standard: 175 } },
          { label: "Full integration (checkout on-site)", value: { scene: 150, standard: 350 } },
        ],
      },
      {
        id: "blog",
        label: "Blog / news section",
        type: "toggle",
        value: { scene: 100, standard: 250 },
      },
      {
        id: "copywriting",
        label: "Copywriting (per page)",
        type: "number",
        unit: { scene: 40, standard: 100 },
        suffix: "page(s)",
      },
      {
        id: "domain",
        label: "Custom domain setup/migration",
        type: "toggle",
        value: { scene: 25, standard: 50 },
      },
      {
        id: "revisions",
        label: "Extra revision rounds",
        type: "number",
        unit: { scene: 40, standard: 100 },
        suffix: "round(s)",
      },
      {
        id: "rush",
        label: "Rush timeline (+25% of subtotal)",
        type: "toggle",
        percent: 0.25,
      },
    ],
  },

  automation: {
    label: "Digital Systems & Automation",
    base: { scene: 200, standard: 500 },
    extras: [
      {
        id: "note",
        label: "Backline modules and monthly access are quoted separately — this estimate covers custom automation project work only.",
        type: "info",
      },
    ],
  },

  design: {
    label: "Design Only",
    base: { scene: 100, standard: 350 },
    extras: [
      {
        id: "pages",
        label: "Additional page mockups",
        type: "number",
        unit: { scene: 50, standard: 125 },
        suffix: "page(s)",
      },
      {
        id: "revisions",
        label: "Extra revision rounds",
        type: "number",
        unit: { scene: 40, standard: 100 },
        suffix: "round(s)",
      },
    ],
  },

  quicktask: {
    label: "Quick Tasks",
    base: { scene: 30, standard: 100 },
    extras: [
      {
        id: "rush",
        label: "Rush delivery (+25% of subtotal)",
        type: "toggle",
        percent: 0.25,
      },
    ],
  },
};

const PQ_TEMPLATE = document.createElement("template");
PQ_TEMPLATE.innerHTML = `
<style>
  :host {
    --pq-bg: #131313;
    --pq-fg: #ffffff;
    --pq-muted: #9a9a9a;
    --pq-border: var(--border-color, #737373);
    --pq-accent: #6fdc4d;
    --pq-font-heading: 'Arial Narrow', 'Helvetica Neue', sans-serif;
    --pq-font-body: 'Arial Narrow', 'Helvetica Neue', sans-serif;

    position: relative;
    display: block;
    background: var(--pq-bg);
    border: 1px solid var(--pq-border);
    border-radius: 6px;
    padding: 28px;
    font-family: var(--pq-font-body);
    color: var(--pq-fg);
    max-width: 640px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  * { box-sizing: border-box; }

  h3 {
    font-family: var(--pq-font-heading);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 20px;
    margin: 0 0 20px;
  }

  .field {
    margin-bottom: 20px;
  }

  .field label.field-label {
    display: block;
    font-size: 13px;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--pq-muted);
    margin-bottom: 8px;
  }

  select,
  input[type="number"] {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid var(--pq-border);
    color: var(--pq-fg);
    padding: 10px 12px;
    font-family: var(--pq-font-body);
    font-size: 14px;
    border-radius: 4px;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .toggle-row input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: var(--pq-accent);
    cursor: pointer;
  }

  .toggle-row span {
    font-size: 14px;
  }

  .tier-row {
    display: flex;
    gap: 10px;
  }

  .tier-btn {
    flex: 1;
    padding: 10px;
    text-align: center;
    background: #0a0a0a;
    border: 1px solid var(--pq-border);
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: var(--pq-muted);
    transition: color 0.15s ease, border-color 0.15s ease;
  }

  .tier-btn.active {
    color: var(--pq-fg);
    border-color: var(--pq-accent);
  }

  .info-note {
    font-size: 13px;
    color: var(--pq-muted);
    line-height: 1.5;
    padding: 12px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 4px;
  }

  .result {
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid var(--pq-border);
    text-align: center;
  }

  .result-label {
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--pq-muted);
    margin: 0 0 6px;
  }

  .result-value {
    font-family: var(--pq-font-heading);
    font-weight: 700;
    font-size: 36px;
  }

  .result-note {
    font-size: 12px;
    color: var(--pq-muted);
    margin-top: 8px;
  }

  .cta {
    display: inline-block;
    margin-top: 18px;
    padding: 12px 28px;
    background: var(--pq-fg);
    color: #0a0a0a;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    font-size: 13px;
    text-decoration: none;
    border-radius: 4px;
  }
</style>

<h3>Get a Ballpark Estimate</h3>

<div class="field">
  <label class="field-label">Rate</label>
  <div class="tier-row" id="tier-row"></div>
</div>

<div class="field">
  <label class="field-label">What do you need?</label>
  <select id="service-select"></select>
</div>

<div id="extras-container"></div>

<div class="result">
  <p class="result-label">Estimated Total</p>
  <p class="result-value" id="result-value">$0</p>
  <p class="result-note">This is a rough estimate, not a final quote. Reach out for exact pricing.</p>
  <a class="cta" id="cta-link" href="/contact">Get a Real Quote</a>
</div>
`;

class PricingQuiz extends HTMLElement {
  static get observedAttributes() {
    return ["contact-url"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(PQ_TEMPLATE.content.cloneNode(true));
    this._tier = "scene";
    this._serviceKey = "website";
  }

  connectedCallback() {
    this._renderTiers();
    this._renderServiceOptions();
    this._renderExtras();
    this._calculate();

    const ctaLink = this.shadowRoot.getElementById("cta-link");
    ctaLink.href = this.getAttribute("contact-url") || "/contact";
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      const ctaLink = this.shadowRoot.getElementById("cta-link");
      if (ctaLink) ctaLink.href = this.getAttribute("contact-url") || "/contact";
    }
  }

  _renderTiers() {
    const row = this.shadowRoot.getElementById("tier-row");
    row.innerHTML = Object.entries(RATE_TIERS)
      .map(([key, tier]) => `<div class="tier-btn${key === this._tier ? " active" : ""}" data-tier="${key}">${tier.label}</div>`)
      .join("");

    row.querySelectorAll(".tier-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._tier = btn.dataset.tier;
        row.querySelectorAll(".tier-btn").forEach((b) => b.classList.toggle("active", b === btn));
        this._calculate();
      });
    });
  }

  _renderServiceOptions() {
    const select = this.shadowRoot.getElementById("service-select");
    select.innerHTML = Object.entries(SERVICES)
      .map(([key, svc]) => `<option value="${key}">${svc.label}</option>`)
      .join("");
    select.value = this._serviceKey;

    select.addEventListener("change", () => {
      this._serviceKey = select.value;
      this._renderExtras();
      this._calculate();
    });
  }

  _renderExtras() {
    const container = this.shadowRoot.getElementById("extras-container");
    const service = SERVICES[this._serviceKey];

    container.innerHTML = service.extras
      .map((extra) => {
        if (extra.type === "info") {
          return `<div class="field"><div class="info-note">${extra.label}</div></div>`;
        }
        if (extra.type === "toggle") {
          return `
            <div class="field">
              <label class="toggle-row">
                <input type="checkbox" data-extra="${extra.id}" />
                <span>${extra.label}</span>
              </label>
            </div>
          `;
        }
        if (extra.type === "number") {
          return `
            <div class="field">
              <label class="field-label">${extra.label} (${extra.suffix})</label>
              <input type="number" min="0" value="0" data-extra="${extra.id}" />
            </div>
          `;
        }
        if (extra.type === "select") {
          return `
            <div class="field">
              <label class="field-label">${extra.label}</label>
              <select data-extra="${extra.id}">
                ${extra.options.map((opt, i) => `<option value="${i}">${opt.label}</option>`).join("")}
              </select>
            </div>
          `;
        }
        return "";
      })
      .join("");

    container.querySelectorAll("[data-extra]").forEach((el) => {
      const eventName = el.tagName === "SELECT" || el.type === "number" ? "input" : "change";
      el.addEventListener(eventName, () => this._calculate());
    });
  }

  _calculate() {
    const service = SERVICES[this._serviceKey];
    const tier = this._tier;

    let subtotal = service.base[tier];
    let rushPercent = 0;

    const container = this.shadowRoot.getElementById("extras-container");

    service.extras.forEach((extra) => {
      if (extra.type === "info") return;

      const el = container.querySelector(`[data-extra="${extra.id}"]`);
      if (!el) return;

      if (extra.type === "toggle") {
        if (extra.percent) {
          if (el.checked) rushPercent += extra.percent;
        } else if (el.checked) {
          subtotal += extra.value[tier];
        }
      } else if (extra.type === "number") {
        const qty = Math.max(0, parseInt(el.value, 10) || 0);
        subtotal += qty * extra.unit[tier];
      } else if (extra.type === "select") {
        const opt = extra.options[Number(el.value)];
        if (opt) subtotal += opt.value[tier];
      }
    });

    const total = Math.round(subtotal * (1 + rushPercent));

    this.shadowRoot.getElementById("result-value").textContent = `$${total.toLocaleString()}`;
  }
}

customElements.define("pricing-quiz", PricingQuiz);