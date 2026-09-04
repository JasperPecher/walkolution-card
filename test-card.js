// Deep test runner for WalkolutionCard and WalkolutionCardEditor
const assert = require('assert');

// Global mock DOM
let definedElements = {};
global.window = {};
global.customElements = {
  get: (name) => definedElements[name],
  define: (name, cls) => {
    definedElements[name] = cls;
  },
};
global.HTMLElement = class {
  constructor() {
    this.shadowRoot = null;
  }
  attachShadow(opts) {
    this.shadowRoot = {
      innerHTML: '',
      querySelector: (selector) => null,
    };
    return this.shadowRoot;
  }
};
global.document = {
  createElement: (tag) => {
    const Cls = definedElements[tag] || global.HTMLElement;
    return new Cls();
  },
};

require('./walkolution-card.js');

const WalkolutionCard = definedElements['walkolution-card'];
const WalkolutionCardEditor = definedElements['walkolution-card-editor'];

assert(WalkolutionCard, 'WalkolutionCard should be defined');
assert(WalkolutionCardEditor, 'WalkolutionCardEditor should be defined');

const card = new WalkolutionCard();
card.setConfig({});

// Mock HASS
const mockHass = {
  states: {
    'sensor.walkolution_daily': { state: '3450' }, // 3.45 km
    'sensor.walkolution_today_steps': { state: '4521' },
    'sensor.walkolution_total': { state: '128450' }, // 128.45 km
  },
};

card.hass = mockHass;

const html = card.shadowRoot.innerHTML;
console.log('Generated HTML output:\n', html);

// Check formatting
assert(html.includes("Today's Session:"), 'Should include Today session label');
assert(html.includes("3.45 km"), 'Should correctly divide 3450 by 1000 and format with 2 decimals');
assert(html.includes("4,521") || html.includes("4521"), 'Should display steps properly');
assert(html.includes("128.45 km"), 'Should correctly divide total distance and format with 2 decimals');
assert(html.includes("font-size: 24px"), 'Session font size should be 24px');
assert(html.includes("font-size: 30px"), 'Steps font size should be 30px');
assert(html.includes("font-size: 22px"), 'Total font size should be 22px');

// Test bold formatting and alignment
card.setConfig({
  bold_labels: true,
  bold_values: false,
  session_distance_bold_value: true,
  text_align: 'left',
  card_font_size: '32px',
});
card.hass = mockHass;
const boldHtml = card.shadowRoot.innerHTML;
assert(boldHtml.includes('text-align: left;'), 'Should update text-align to left');
assert(boldHtml.includes('font-size: 32px;'), 'Should update card_font_size to 32px');
assert(boldHtml.includes('stat-label bold'), 'All labels should be bold');
assert(boldHtml.includes('<span class="stat-value bold">3.45 km</span>'), 'Session value should be bold override');
assert(boldHtml.includes('<span class="stat-value ">4,521</span>'), 'Steps value should NOT be bold');

// Test unavailable / missing entity
card.hass = {
  states: {
    'sensor.walkolution_daily': { state: 'unavailable' },
    'sensor.walkolution_today_steps': { state: 'unknown' },
    'sensor.walkolution_total': null,
  }
};
const unavailHtml = card.shadowRoot.innerHTML;
assert(unavailHtml.includes('unavailable'), 'Should display unavailable gracefully');
assert(unavailHtml.includes('unknown'), 'Should display unknown gracefully');
assert(unavailHtml.includes('—'), 'Should display dash for missing entity object');

// Test editor
const editor = new WalkolutionCardEditor();
editor.setConfig({ bold_labels: true, session_distance_font_size: '28px' });
const schema = editor._getSchema();
assert(Array.isArray(schema), 'Schema should be an array');
console.log('Schema entries:', schema.length);

console.log('All tests passed successfully!');
