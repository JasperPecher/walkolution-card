# Walkolution Card for Home Assistant

A lightweight, reliable custom Lovelace card for Home Assistant to display your **Walkolution** manual treadmill statistics (Today's Session Distance, Session Steps, and Total Distance).

Designed specifically to solve styling and loading issues on **Google Home / Nest Hub Cast displays** where `custom:mod-card` or shadow-DOM CSS injections often fail or render inconsistently.

---

## ✨ Features

- 📺 **100% Google Home & Nest Hub Compatible**: Built with native Vanilla Web Components (`HTMLElement` + Shadow DOM) without external library dependencies or CSS hacks. Renders reliably on Google Cast.
- 🎨 **Visual UI Editor**: Fully configurable directly from the Home Assistant dashboard editor (`ha-form`), no manual YAML editing required.
- 🔤 **Complete Typography Control**:
  - Customize font sizes for each individual metric (e.g., `24px`, `30px`, `22px`, `1.5rem`).
  - Adjust the card's base font size.
  - Toggle **Bold/Strong** text for labels, values, or both.
- 🔢 **Unit & Number Formatting**:
  - Custom divisors (e.g., `1000` to convert meters to kilometers).
  - Decimal precision setting for each row (e.g. `2` decimals for distance, `0` for steps).
  - Custom units (`km`, `steps`, `mi`, etc.).
- ↔️ **Alignment & Layout**: Center, left, or right alignment with customizable row spacing and padding.
- ⚡ **Lightweight & Fast**: Zero bundle dependencies, minimal memory footprint.

---

## 🚀 Installation

1. Download [`walkolution-card.js`](walkolution-card.js) from this repository.
2. Copy `walkolution-card.js` to your Home Assistant configuration directory under:
   ```text
   /config/www/walkolution-card.js
   ```
3. In Home Assistant, go to **Settings** -> **Dashboards** -> click the three dots in the top right corner -> **Resources**.
4. Click **Add Resource**:
   - **URL**: `/local/walkolution-card.js`
   - **Resource type**: `JavaScript Module`
5. Refresh your browser cache.

---

## 🛠️ Usage & Configuration

### Visual Editor

1. Open your Home Assistant dashboard and click **Edit Dashboard**.
2. Click **Add Card** and search for **Walkolution Card**.
3. Use the visual editor to:
   - Select your sensor entities.
   - Adjust font sizes (e.g. `24px`, `30px`, `22px`).
   - Toggle **Bold Labels** and/or **Bold Values**.
   - Change alignment, row spacing, units, and decimal places.

---

### YAML Configuration Examples

#### 1. Default (Replaces `mod-card` + `markdown`)

This matches the default layout and font sizes of your original markdown card:

```yaml
type: custom:walkolution-card
session_distance_entity: sensor.walkolution_daily
session_steps_entity: sensor.walkolution_today_steps
total_distance_entity: sensor.walkolution_total
```

#### 2. Customized Font Sizes with Bold Values

```yaml
type: custom:walkolution-card
title: "🏃 Walkolution Stats"
text_align: center
bold_labels: false
bold_values: true

# Today's Session
session_distance_entity: sensor.walkolution_daily
session_distance_label: "✌️ Today's Session:"
session_distance_unit: "km"
session_distance_divisor: 1000
session_distance_decimals: 2
session_distance_font_size: "26px"

# Session Steps
session_steps_entity: sensor.walkolution_today_steps
session_steps_label: "👣 Session Steps:"
session_steps_font_size: "34px"
session_steps_bold_value: true

# Total Distance
total_distance_entity: sensor.walkolution_total
total_distance_label: "📊 Total Distance:"
total_distance_unit: "km"
total_distance_divisor: 1000
total_distance_decimals: 2
total_distance_font_size: "24px"
```

#### 3. Left-Aligned & Compact

```yaml
type: custom:walkolution-card
text_align: left
row_spacing: "8px"
card_font_size: "20px"
bold_labels: true
bold_values: false
session_distance_font_size: "20px"
session_steps_font_size: "22px"
total_distance_font_size: "18px"
```

---

## ⚙️ Configuration Options

| Option                        | Type      | Default                          | Description                                                    |
| :---------------------------- | :-------- | :------------------------------- | :------------------------------------------------------------- |
| `type`                        | `string`  | **Required**                     | `custom:walkolution-card`                                      |
| `title`                       | `string`  | _Optional_                       | Optional title displayed at the top of the card                |
| `text_align`                  | `string`  | `center`                         | Text alignment (`center`, `left`, `right`)                     |
| `card_font_size`              | `string`  | `30px`                           | Base font size for the card container                          |
| `row_spacing`                 | `string`  | `12px`                           | Vertical spacing between stat rows                             |
| `card_padding`                | `string`  | `16px`                           | Card internal padding                                          |
| `bold_labels`                 | `boolean` | `false`                          | When `true`, makes all stat labels bold                        |
| `bold_values`                 | `boolean` | `false`                          | When `true`, makes all stat values bold                        |
| **Session Distance**          |           |                                  |                                                                |
| `session_distance_entity`     | `string`  | `sensor.walkolution_daily`       | Entity for today's session distance                            |
| `session_distance_label`      | `string`  | `✌️ Today's Session:`            | Label / prefix text for session distance                       |
| `session_distance_unit`       | `string`  | `km`                             | Unit string displayed after the value                          |
| `session_distance_divisor`    | `number`  | `1000`                           | Divisor applied to the raw entity state (e.g. 1000 for m → km) |
| `session_distance_decimals`   | `number`  | `2`                              | Number of decimal places to display                            |
| `session_distance_font_size`  | `string`  | `24px`                           | Font size for this row                                         |
| `session_distance_bold_label` | `boolean` | `false`                          | Make this row's label bold (overrides `bold_labels`)           |
| `session_distance_bold_value` | `boolean` | `false`                          | Make this row's value bold (overrides `bold_values`)           |
| **Session Steps**             |           |                                  |                                                                |
| `session_steps_entity`        | `string`  | `sensor.walkolution_today_steps` | Entity for session steps                                       |
| `session_steps_label`         | `string`  | `👣 Session Steps:`              | Label / prefix text for session steps                          |
| `session_steps_unit`          | `string`  | `""`                             | Unit string displayed after steps (blank by default)           |
| `session_steps_divisor`       | `number`  | `1`                              | Divisor applied to raw steps count                             |
| `session_steps_decimals`      | `number`  | `0`                              | Decimal places for steps                                       |
| `session_steps_font_size`     | `string`  | `30px`                           | Font size for this row                                         |
| `session_steps_bold_label`    | `boolean` | `false`                          | Make steps label bold                                          |
| `session_steps_bold_value`    | `boolean` | `false`                          | Make steps value bold                                          |
| **Total Distance**            |           |                                  |                                                                |
| `total_distance_entity`       | `string`  | `sensor.walkolution_total`       | Entity for total cumulative distance                           |
| `total_distance_label`        | `string`  | `📊 Total Distance:`             | Label / prefix text for total distance                         |
| `total_distance_unit`         | `string`  | `km`                             | Unit string displayed after total distance                     |
| `total_distance_divisor`      | `number`  | `1000`                           | Divisor applied to raw total (e.g. 1000 for m → km)            |
| `total_distance_decimals`     | `number`  | `2`                              | Decimal places for total distance                              |
| `total_distance_font_size`    | `string`  | `22px`                           | Font size for this row                                         |
| `total_distance_bold_label`   | `boolean` | `false`                          | Make total distance label bold                                 |
| `total_distance_bold_value`   | `boolean` | `false`                          | Make total distance value bold                                 |

---

## 💡 Google Home / Nest Hub Tips

When casting Home Assistant dashboards to Google Cast devices:

- Google Cast caches dashboard resources aggressively. After updating the file, increment the version in the resource URL (e.g. `/local/walkolution-card.js?v=1.0.1`) or reboot your Cast display if changes don't appear immediately.
- Because this card encapsulates styles entirely within Shadow DOM without external CSS injection, font sizes and alignments will render identically on your phone, desktop, and Nest Hub display.

---

## 📄 License

MIT
