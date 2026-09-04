/**
 * Walkolution Card for Home Assistant Lovelace
 * Optimized for Google Home / Nest Hub displays & standard dashboards.
 * No external dependencies. Pure vanilla custom element with Shadow DOM.
 */

console.info(
  "%c WALKOULTION-CARD ",
  "color: white; background: #2e7d32; font-weight: bold; padding: 2px 6px; border-radius: 4px;",
);

const DEFAULT_CONFIG = {
  title: "",
  text_align: "center",
  card_font_size: "30px",
  row_spacing: "12px",
  card_padding: "16px",
  bold_labels: false,
  bold_values: false,

  // Row 1: Session Distance
  session_distance_entity: "sensor.walkolution_daily",
  session_distance_label: "✌️ Today's Session:",
  session_distance_unit: "km",
  session_distance_divisor: 1000,
  session_distance_decimals: 2,
  session_distance_font_size: "20px",
  session_distance_bold_label: false,
  session_distance_bold_value: false,

  // Row 2: Session Steps
  session_steps_entity: "sensor.walkolution_today_steps",
  session_steps_label: "👣 Session Steps:",
  session_steps_unit: "",
  session_steps_divisor: 1,
  session_steps_decimals: 0,
  session_steps_font_size: "20px",
  session_steps_bold_label: false,
  session_steps_bold_value: false,

  // Row 3: Total Distance
  total_distance_entity: "sensor.walkolution_total",
  total_distance_label: "📊 Total Distance:",
  total_distance_unit: "km",
  total_distance_divisor: 1000,
  total_distance_decimals: 2,
  total_distance_font_size: "20px",
  total_distance_bold_label: false,
  total_distance_bold_value: false,
};

class WalkolutionCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._hass = null;
  }

  static getConfigElement() {
    return document.createElement("walkolution-card-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:walkolution-card",
      ...DEFAULT_CONFIG,
    };
  }

  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
    };
    this._updateContent();
  }

  set hass(hass) {
    const oldHass = this._hass;
    this._hass = hass;

    // Only re-render if entity states have actually changed
    if (!oldHass || this._hasStateChanged(oldHass, hass)) {
      this._updateContent();
    }
  }

  _hasStateChanged(oldHass, newHass) {
    if (!oldHass || !newHass || !oldHass.states || !newHass.states) {
      return true;
    }

    const entities = [
      this._config.session_distance_entity,
      this._config.session_steps_entity,
      this._config.total_distance_entity,
    ].filter(Boolean);

    for (const entity of entities) {
      if (!oldHass.states[entity] || !newHass.states[entity]) {
        return true;
      }
      if (oldHass.states[entity].state !== newHass.states[entity].state) {
        return true;
      }
    }
    return false;
  }

  _formatValue(entityId, divisor, decimals) {
    if (!this._hass || !this._hass.states || !entityId) return "—";
    const stateObj = this._hass.states[entityId];
    if (!stateObj) return "—";

    const rawState = stateObj.state;
    if (rawState === "unavailable" || rawState === "unknown") {
      return rawState;
    }

    const num = parseFloat(rawState);
    if (isNaN(num)) {
      return rawState;
    }

    const div = parseFloat(divisor) || 1;
    const computed = num / div;
    const dec = parseInt(decimals, 10);

    if (isNaN(dec) || dec < 0) {
      return computed.toString();
    }

    return computed.toLocaleString(undefined, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });
  }

  _updateContent() {
    if (!this.shadowRoot) return;

    const config = this._config;
    const sessionVal = this._formatValue(
      config.session_distance_entity,
      config.session_distance_divisor,
      config.session_distance_decimals,
    );
    const stepsVal = this._formatValue(
      config.session_steps_entity,
      config.session_steps_divisor,
      config.session_steps_decimals,
    );
    const totalVal = this._formatValue(
      config.total_distance_entity,
      config.total_distance_divisor,
      config.total_distance_decimals,
    );

    const rows = [];

    if (config.session_distance_entity) {
      rows.push({
        id: "session",
        label: config.session_distance_label ?? "✌️ Today's Session:",
        val: sessionVal,
        unit: config.session_distance_unit
          ? ` ${config.session_distance_unit}`
          : "",
        fontSize: config.session_distance_font_size || "24px",
        boldLabel: config.session_distance_bold_label || config.bold_labels,
        boldValue: config.session_distance_bold_value || config.bold_values,
      });
    }

    if (config.session_steps_entity) {
      rows.push({
        id: "steps",
        label: config.session_steps_label ?? "👣 Session Steps:",
        val: stepsVal,
        unit: config.session_steps_unit ? ` ${config.session_steps_unit}` : "",
        fontSize: config.session_steps_font_size || "30px",
        boldLabel: config.session_steps_bold_label || config.bold_labels,
        boldValue: config.session_steps_bold_value || config.bold_values,
      });
    }

    if (config.total_distance_entity) {
      rows.push({
        id: "total",
        label: config.total_distance_label ?? "📊 Total Distance:",
        val: totalVal,
        unit: config.total_distance_unit
          ? ` ${config.total_distance_unit}`
          : "",
        fontSize: config.total_distance_font_size || "22px",
        boldLabel: config.total_distance_bold_label ?? config.bold_labels,
        boldValue: config.total_distance_bold_value ?? config.bold_values,
      });
    }

    const titleHtml = config.title
      ? `<div class="card-header">${this._escapeHtml(config.title)}</div>`
      : "";

    const rowsHtml = rows
      .map(
        (r) => `
        <div class="stat-row row-${r.id}" style="font-size: ${r.fontSize};">
          <span class="stat-label ${r.boldLabel ? "bold" : ""}">${this._escapeHtml(r.label)}</span>
          <span class="stat-value ${r.boldValue ? "bold" : ""}">${this._escapeHtml(r.val)}${this._escapeHtml(r.unit)}</span>
        </div>
      `,
      )
      .join("");

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        ha-card {
          font-size: ${config.card_font_size || "30px"};
          padding: ${config.card_padding || "16px"};
          box-sizing: border-box;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .card-header {
          font-size: 1.2em;
          font-weight: 500;
          padding-bottom: 8px;
          text-align: ${config.text_align || "center"};
          color: var(--primary-text-color);
        }
        .stats-container {
          display: flex;
          flex-direction: column;
          gap: ${config.row_spacing || "12px"};
          text-align: ${config.text_align || "center"};
          color: var(--primary-text-color);
          width: 100%;
        }
        .stat-row {
          line-height: 1.3;
          display: block;
        }
        .stat-label {
          display: inline;
        }
        .stat-value {
          display: inline;
          margin-left: 0.35em;
        }
        .bold {
          font-weight: bold;
        }
      </style>
      <ha-card>
        ${titleHtml}
        <div class="stats-container">
          ${rowsHtml}
        </div>
      </ha-card>
    `;
  }

  _escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  getCardSize() {
    return 3;
  }
}

class WalkolutionCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._form = null;
  }

  connectedCallback() {
    this._render();
  }

  setConfig(config) {
    this._config = { ...DEFAULT_CONFIG, ...config };
    if (!this._form) {
      this._render();
    } else {
      this._form.data = this._config;
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) {
      this._form.hass = hass;
    }
  }

  _getSchema() {
    return [
      {
        name: "title",
        label: "Card Title (Optional)",
        selector: { text: {} },
      },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "text_align",
            label: "Text Alignment",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "center", label: "Center" },
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ],
              },
            },
          },
          {
            name: "card_font_size",
            label: "Card Base Font Size (e.g. 30px)",
            selector: { text: {} },
          },
          {
            name: "row_spacing",
            label: "Row Spacing (e.g. 12px)",
            selector: { text: {} },
          },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "bold_labels",
            label: "Bold All Labels by Default",
            selector: { boolean: {} },
          },
          {
            name: "bold_values",
            label: "Bold All Values by Default",
            selector: { boolean: {} },
          },
        ],
      },
      {
        name: "",
        type: "expandable",
        title: "Today's Session Distance",
        icon: "mdi:run-fast",
        schema: [
          {
            name: "session_distance_entity",
            label: "Entity",
            selector: { entity: { domain: "sensor" } },
          },
          {
            name: "session_distance_label",
            label: "Label",
            selector: { text: {} },
          },
          {
            name: "session_distance_font_size",
            label: "Font Size (e.g. 24px)",
            selector: { text: {} },
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "session_distance_unit",
                label: "Unit",
                selector: { text: {} },
              },
              {
                name: "session_distance_divisor",
                label: "Divisor (1000 for m -> km)",
                selector: { number: { mode: "box", step: "any" } },
              },
              {
                name: "session_distance_decimals",
                label: "Decimals",
                selector: { number: { mode: "box", min: 0, max: 6 } },
              },
            ],
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "session_distance_bold_label",
                label: "Bold Label",
                selector: { boolean: {} },
              },
              {
                name: "session_distance_bold_value",
                label: "Bold Value",
                selector: { boolean: {} },
              },
            ],
          },
        ],
      },
      {
        name: "",
        type: "expandable",
        title: "Session Steps",
        icon: "mdi:shoe-print",
        schema: [
          {
            name: "session_steps_entity",
            label: "Entity",
            selector: { entity: { domain: "sensor" } },
          },
          {
            name: "session_steps_label",
            label: "Label",
            selector: { text: {} },
          },
          {
            name: "session_steps_font_size",
            label: "Font Size (e.g. 30px)",
            selector: { text: {} },
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "session_steps_unit",
                label: "Unit",
                selector: { text: {} },
              },
              {
                name: "session_steps_divisor",
                label: "Divisor (1 for raw count)",
                selector: { number: { mode: "box", step: "any" } },
              },
              {
                name: "session_steps_decimals",
                label: "Decimals",
                selector: { number: { mode: "box", min: 0, max: 6 } },
              },
            ],
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "session_steps_bold_label",
                label: "Bold Label",
                selector: { boolean: {} },
              },
              {
                name: "session_steps_bold_value",
                label: "Bold Value",
                selector: { boolean: {} },
              },
            ],
          },
        ],
      },
      {
        name: "",
        type: "expandable",
        title: "Total Distance",
        icon: "mdi:chart-bar",
        schema: [
          {
            name: "total_distance_entity",
            label: "Entity",
            selector: { entity: { domain: "sensor" } },
          },
          {
            name: "total_distance_label",
            label: "Label",
            selector: { text: {} },
          },
          {
            name: "total_distance_font_size",
            label: "Font Size (e.g. 22px)",
            selector: { text: {} },
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "total_distance_unit",
                label: "Unit",
                selector: { text: {} },
              },
              {
                name: "total_distance_divisor",
                label: "Divisor (1000 for m -> km)",
                selector: { number: { mode: "box", step: "any" } },
              },
              {
                name: "total_distance_decimals",
                label: "Decimals",
                selector: { number: { mode: "box", min: 0, max: 6 } },
              },
            ],
          },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "total_distance_bold_label",
                label: "Bold Label",
                selector: { boolean: {} },
              },
              {
                name: "total_distance_bold_value",
                label: "Bold Value",
                selector: { boolean: {} },
              },
            ],
          },
        ],
      },
    ];
  }

  _render() {
    if (!this.shadowRoot) return;

    if (!this._form) {
      this.shadowRoot.innerHTML = `
        <div class="card-config">
          <ha-form></ha-form>
        </div>
        <style>
          .card-config {
            display: block;
            padding: 8px 0;
          }
        </style>
      `;

      this._form = this.shadowRoot.querySelector("ha-form");
      if (this._form) {
        this._form.schema = this._getSchema();
        this._form.computeLabel = (s) => s.label || s.name;
        this._form.addEventListener("value-changed", (e) => {
          this._valueChanged(e);
        });
      }
    }

    if (this._form) {
      if (this._hass) {
        this._form.hass = this._hass;
      }
      this._form.data = this._config;
    }
  }

  _valueChanged(ev) {
    ev.stopPropagation();
    if (!this._config) return;
    const newConfig = {
      ...this._config,
      ...ev.detail.value,
    };

    this._config = newConfig;

    const event = new CustomEvent("config-changed", {
      detail: { config: newConfig },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }
}

// Register elements with browser
if (!customElements.get("walkolution-card")) {
  customElements.define("walkolution-card", WalkolutionCard);
}
if (!customElements.get("walkolution-card-editor")) {
  customElements.define("walkolution-card-editor", WalkolutionCardEditor);
}

// Register card in Home Assistant custom card registry
window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "walkolution-card")) {
  window.customCards.push({
    type: "walkolution-card",
    name: "Walkolution Card",
    description:
      "Walkolution treadmill stats with visual editor, custom font sizes, and Google Home/Nest Hub compatibility.",
    preview: true,
  });
}
