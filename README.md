# JSON Formatter — Chrome Extension

A fast, lightweight Chrome extension that automatically formats and syntax-highlights JSON, with collapsible nodes and a built-in popup formatter.

![Uploading image.png…]()

---

## Features

| Feature | Description |
|---|---|
| **Auto-format JSON pages** | Detects raw JSON responses and replaces the plain page with a formatted, interactive tree |
| **Popup formatter** | Paste any JSON into the popup to format and validate it instantly |
| **Syntax highlighting** | Keys, strings, numbers, booleans, and null values are color-coded |
| **Collapsible nodes** | Click `▼`/`▶` to collapse or expand any object or array |
| **Collapse / Expand All** | One-click to collapse or expand the entire tree |
| **Copy Formatted** | Copies pretty-printed JSON (2-space indent) to clipboard |
| **Copy Minified** | Copies compact JSON (no whitespace) to clipboard |
| **Error validation** | Shows the exact parse error message for invalid JSON |
| **Auto-format on paste** | The popup automatically formats when you paste JSON |

---

## File Structure

```
JsonFormat/
├── manifest.json   — Chrome extension manifest (Manifest V3)
├── renderer.js     — Shared JSON tree renderer (used by both views)
├── content.js      — Content script: detects and formats raw JSON pages
├── content.css     — Styles for the auto-formatted JSON page view
├── popup.html      — Popup UI layout and styles
└── popup.js        — Popup logic (format, validate, copy)
```

---

## Installation

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `JsonFormat` folder
5. The extension icon appears in your toolbar — pin it for easy access

---

## Usage

### Auto-format (JSON pages)

Navigate to any URL that returns raw JSON — for example:

```
https://api.github.com/users/github
```

The extension automatically replaces the plain text with a formatted, interactive tree. Use the sticky header to:
- **Collapse All** / **Expand All** the tree
- **Copy JSON** to clipboard (formatted, 2-space indent)

### Popup formatter

1. Click the extension icon in the toolbar
2. Paste JSON into the text area (auto-formats on paste)
3. Or click **Format** / press `Ctrl+Enter` (`Cmd+Enter` on Mac)
4. Use **⎘ Formatted** to copy pretty-printed JSON
5. Use **⎘ Minified** to copy compact JSON

### Collapsible nodes

- Click **▼** on any object `{}` or array `[]` to collapse it
- Click **▶** to expand it again
- Collapsed nodes show a summary: `{ 3 keys }` or `[ 12 items ]`

---

## Syntax Color Reference

| Token | Color |
|---|---|
| Keys | Violet |
| Strings | Amber |
| Numbers | Sky blue |
| Booleans | Cyan |
| null | Slate grey |

---

## Development

No build step required — plain HTML, CSS, and JavaScript.

After editing any file, go to `chrome://extensions` and click the **↺ refresh** button on the extension card to reload it.
