# Walkolution Card for Home Assistant

A lightweight, reliable custom Lovelace card for Home Assistant to display your **Walkolution** manual treadmill statistics (Today's Session Distance, Session Steps, and Total Distance).

Designed specifically to eliminate styling and loading issues on **Google Home / Nest Hub Cast displays** where `custom:mod-card` or shadow-DOM CSS injections often fail or render inconsistently.

---

## Installation Guide

> [!IMPORTANT]
> In Home Assistant, manually added files in the `/config/www/` directory must be registered under **Dashboards → Resources**, **NOT** under HACS _Repositories_.

### Step 1: Copy file to `/config/www/`

Place [`walkolution-card.js`](walkolution-card.js) inside your Home Assistant `www` folder:

```text
/config/www/walkolution-card.js
```

_(Note: Home Assistant maps `/config/www/` internally to the web URL `/local/`)_.

---

### Step 2: Enable "Advanced Mode" in Home Assistant

If you do not see the "Resources" tab in Home Assistant, you need to enable Advanced Mode:

1. In Home Assistant, click on your **User Profile** (your username / avatar in the bottom-left corner of the sidebar).
2. Scroll down and toggle **Advanced Mode** to **ON**.

---

### Step 3: Add the Resource

1. Navigate to **Settings** → **Dashboards**.
2. Click the **three vertical dots `⋮`** in the top-right corner.
3. Select **Resources**.
4. Click the **+ Add Resource** button in the bottom-right corner.
5. Enter the following details:
   - **URL**: `/local/walkolution-card.js`
   - **Resource Type**: `JavaScript Module`
6. Click **Create**.

---

### Step 4: Refresh Your Browser Cache

Home Assistant and browsers cache dashboard resources aggressively:

- **Chrome / Edge (Mac)**: Press `Cmd` + `Shift` + `R`
- **Chrome / Edge (Windows)**: Press `Ctrl` + `F5`
- **Home Assistant Companion App**: Settings → Companion App → Debugging → Refresh Frontend Cache

---

## 🛠️ Adding the Card to your Dashboard

### Option A: From the Card Picker (Visual Editor)

1. Open your dashboard and click **Edit Dashboard** (three dots top-right → Edit Dashboard).
2. Click **+ Add Card**.
3. Search for **Walkolution Card** in the card list.
4. Use the visual editor to adjust entities, font sizes, bold text, divisors, and alignment!

### Option B: Using the "Manual" Card

If your browser hasn't refreshed the card picker list yet, you can add it directly:

1. Click **+ Add Card** and scroll down to the very bottom.
2. Select **Manual**.
3. Paste the following YAML:

```yaml
type: custom:walkolution-card
session_distance_entity: sensor.walkolution_daily
session_steps_entity: sensor.walkolution_today_steps
total_distance_entity: sensor.walkolution_total
```

4. Click **Save**. You can now edit it visually anytime by clicking **Edit Card**!

---

## Configuration Examples (YAML)

### 1. Default (Matches your original setup)

```yaml
type: custom:walkolution-card
session_distance_entity: sensor.walkolution_daily
session_steps_entity: sensor.walkolution_today_steps
total_distance_entity: sensor.walkolution_total
```

### 2. Custom Font Sizes with Bold Values

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

### 3. Left-Aligned & Compact

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

## Full Configuration Options

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

## Google Home / Nest Hub Tips

When casting Home Assistant dashboards to Google Cast devices:

- If you make changes to `walkolution-card.js` in `/config/www/`, reboot your Cast display or recasting the dashboard will load the latest file.
- Because this card encapsulates styles entirely within Shadow DOM without external CSS injection, font sizes and alignments will render identically on your phone, desktop, and Nest Hub display.
