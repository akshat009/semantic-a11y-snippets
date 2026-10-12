# Semantic A11y Snippets

<!-- count -->63<!-- /count --> snippets for writing semantic, accessible markup in VS Code: a landmark page boilerplate, labelled form fields, ARIA widgets, captioned media, and the CSS and JavaScript that make them work.

Every snippet is expanded and checked against [html-validate](https://html-validate.org/)'s recommended and accessibility rules before each release.

## Usage

In an HTML or PHP file, type `a11y` to list every snippet, pick one, then press <kbd>Tab</kbd> to move through the placeholders.

- `a11y-page` (or `html5s`) inserts a full page with `lang`, a skip link, header, nav, main and footer landmarks, and a single `h1`.
- `a11y-base-css` in a stylesheet adds the visually hidden class, skip link styles, a focus ring and reduced-motion support.

To see these snippets above Emmet and word suggestions, add this to your settings:

```json
"editor.snippetSuggestions": "top"
```

## What makes them accessible

- **Landmarks:** header, nav, main and footer, with sections and asides named by their headings so they appear in screen reader landmark lists.
- **Forms:** every control has a visible label, hints and errors are linked with `aria-describedby`, groups use `fieldset` and `legend`, and inputs carry `autocomplete` tokens for WCAG 1.3.5.
- **Widgets:** disclosure, accordion, tabs, toggle button, switch and modal dialog follow the WAI-ARIA Authoring Practices patterns.
- **Media:** video ships with a captions track and transcript link, and iframes get a `title`.
- **No zoom lock:** the viewport meta never disables pinch zoom.

## Snippets that need CSS or JavaScript

| Snippet | Needs |
| --- | --- |
| `a11y-sr`, `a11y-icon-btn`, `a11y-link-new-tab`, `a11y-pagination`, `a11y-input-error` | The `.visually-hidden` class from `a11y-visually-hidden` or `a11y-base-css` |
| `a11y-skip`, `a11y-page` | Skip link styles from `a11y-skip-css` or `a11y-base-css` |
| `a11y-disclosure`, `a11y-nav-toggle`, `a11y-accordion` | `a11y-disclosure-js` |
| `a11y-tabs` | `a11y-tabs-js` |
| `a11y-toggle`, `a11y-switch` | `a11y-toggle-js` |
| `a11y-error-summary` | Your form script should move focus to it after a failed submit |

`a11y-dialog` opens with the `commandfor` and `command` attributes, so it needs no script in Chrome and Edge 135+, Firefox 144+ and Safari 26.2+. For older browsers, call `dialog.showModal()` from your own code.

## Snippet reference

<!-- snippets:start -->

### Page & landmarks

_Available in HTML and PHP files._

| Prefix | Inserts |
| --- | --- |
| `a11y-page` `html5s` | **Semantic page**: Full HTML5 page: lang, viewport without zoom lock, skip link, header/nav/main/footer landmarks and one h1. |
| `a11y-skip` | **Skip link**: First focusable element on the page; jumps keyboard users past repeated navigation (WCAG 2.4.1). |
| `a11y-header` | **Site header**: Site header landmark with a home link and labelled primary navigation. |
| `a11y-nav` | **Navigation**: Labelled nav landmark; aria-current marks the current page. |
| `a11y-breadcrumb` | **Breadcrumb**: Breadcrumb nav as an ordered list; the last item carries aria-current="page". |
| `a11y-main` | **Main**: Main landmark with the page's single h1; id="main" is the skip link target. |
| `a11y-section` | **Section**: Section named by its heading, so it is exposed as a region landmark. |
| `a11y-article` | **Article**: Self-contained article with heading, machine-readable date and author link. |
| `a11y-aside` | **Aside**: Complementary landmark named by its heading. |
| `a11y-footer` | **Site footer**: Footer landmark with a labelled footer nav and accessibility statement link. |
| `a11y-search` | **Search**: Native search landmark with a visible label and submit button. |

### Content

_Available in HTML and PHP files._

| Prefix | Inserts |
| --- | --- |
| `a11y-sr` | **Screen-reader-only text**: Text read by screen readers but hidden visually. Needs the a11y-visually-hidden CSS. |
| `a11y-img` | **Image**: Informative image with alt text and dimensions to prevent layout shift. |
| `a11y-img-deco` | **Decorative image**: Decorative image with empty alt so screen readers skip it. |
| `a11y-figure` | **Figure**: Image with a visible caption. |
| `a11y-quote` | **Quote**: Blockquote with source and attribution in a figure. |
| `a11y-table` | **Data table**: Table with caption and scoped column and row headers. |
| `a11y-dl` | **Description list**: Term and description pairs. |
| `a11y-details` | **Details**: Native disclosure widget; keyboard and screen reader support built in, no JS. |
| `a11y-time` | **Time**: Date with a machine-readable datetime value (defaults to today). |
| `a11y-abbr` | **Abbreviation**: Abbreviation with its expansion. |
| `a11y-lang` | **Language change**: Marks a phrase in another language so screen readers switch pronunciation (WCAG 3.1.2). |
| `a11y-address` | **Contact address**: Contact details for the page or article owner. |
| `a11y-card` | **Card**: Card with one link on the heading, so screen readers hear the link once. |
| `a11y-link-new-tab` | **New-tab link**: Link that opens a new tab and says so to screen reader users. |
| `a11y-icon-btn` | **Icon button**: Icon-only button with a hidden text label and a hidden icon. |
| `a11y-svg-deco` | **Decorative SVG**: Inline SVG hidden from assistive tech. |
| `a11y-svg` | **Meaningful SVG**: Inline SVG exposed as an image with an accessible name. |

### Media

_Available in HTML and PHP files._

| Prefix | Inserts |
| --- | --- |
| `a11y-video` | **Video**: Video with captions track, fallback download link and transcript link. |
| `a11y-audio` | **Audio**: Audio player with a title and transcript link. |
| `a11y-iframe` | **Iframe**: Embedded frame with a descriptive title. |

### Forms

_Available in HTML and PHP files._

| Prefix | Inserts |
| --- | --- |
| `a11y-form` | **Form**: Form shell with instructions and an explicit submit button. |
| `a11y-input` | **Text input**: Labelled input with hint text and autocomplete for input purpose (WCAG 1.3.5). |
| `a11y-email` | **Email input**: Required email field with autocomplete. |
| `a11y-password` | **Password input**: Password field with hint and correct autocomplete for password managers. |
| `a11y-textarea` | **Textarea**: Labelled multi-line text field. |
| `a11y-select` | **Select**: Labelled select with a placeholder option. |
| `a11y-checkbox` | **Checkbox**: Single checkbox with its label after the control. |
| `a11y-checkboxes` | **Checkbox group**: Related checkboxes grouped by fieldset and legend; name[] submits every checked value. |
| `a11y-radios` | **Radio group**: Radio buttons grouped by fieldset and legend. |
| `a11y-input-error` | **Field with error**: Invalid field: aria-invalid plus an error message linked by aria-describedby (WCAG 3.3.1). |
| `a11y-error-summary` | **Error summary**: List of errors linking to each field. Move focus here after a failed submit. |
| `a11y-progress` | **Progress**: Labelled progress bar with a text fallback. |

### Widgets & live regions

_Available in HTML and PHP files._

| Prefix | Inserts |
| --- | --- |
| `a11y-dialog` | **Dialog**: Native modal dialog opened with commandfor (no JS); focus trap and Escape built in. |
| `a11y-disclosure` | **Disclosure**: Show/hide button with aria-expanded. Pair with a11y-disclosure-js. |
| `a11y-nav-toggle` | **Mobile menu toggle**: Navigation with a menu button using aria-expanded. Pair with a11y-disclosure-js. |
| `a11y-accordion` | **Accordion item**: Accordion section: heading wrapping an aria-expanded button. Pair with a11y-disclosure-js. |
| `a11y-tabs` | **Tabs**: ARIA tabs with roving tabindex. Pair with a11y-tabs-js for arrow-key support. |
| `a11y-toggle` | **Toggle button**: On/off button using aria-pressed. Pair with a11y-toggle-js. |
| `a11y-switch` | **Switch**: On/off switch using role="switch". Pair with a11y-toggle-js. |
| `a11y-pagination` | **Pagination**: Labelled pagination with the current page marked and context for screen readers. |
| `a11y-status` | **Status message**: Polite live region (WCAG 4.1.3). Keep it in the page on load, then inject text. |
| `a11y-alert` | **Alert**: Assertive live region for urgent messages. Keep it in the page on load, then inject text. |

### CSS helpers

_Available in CSS, SCSS and Less files._

| Prefix | Inserts |
| --- | --- |
| `a11y-visually-hidden` | **Visually hidden class**: Hides content visually but keeps it for screen readers; shows it again when focused. |
| `a11y-skip-css` | **Skip link styles**: Keeps the skip link off-screen until it receives keyboard focus. |
| `a11y-focus` | **Focus ring**: Visible focus indicator for keyboard users only (WCAG 2.4.7). |
| `a11y-reduced-motion` | **Reduced motion**: Turns off animation and smooth scrolling for users who ask for less motion. |
| `a11y-forced-colors` | **Forced colors**: Restores borders that Windows High Contrast mode would otherwise remove. |
| `a11y-target-size` | **Target size**: Minimum 24 by 24 px pointer targets (WCAG 2.5.8). |
| `a11y-base-css` | **Accessibility base styles**: Visually hidden class, skip link, focus ring and reduced motion in one block. |

### JavaScript helpers

_Available in JavaScript files._

| Prefix | Inserts |
| --- | --- |
| `a11y-disclosure-js` | **Disclosure script**: Toggles aria-expanded and the controlled element for disclosures, accordions and menu buttons. |
| `a11y-tabs-js` | **Tabs script**: Click and arrow-key/Home/End support for a11y-tabs, with roving tabindex. |
| `a11y-toggle-js` | **Toggle script**: Flips aria-pressed on toggle buttons and aria-checked on switches. |

<!-- snippets:end -->

## Contributing

Snippets are written in `src/*.snippets`, a plain-text format with one block per snippet:

```text
--- Snippet title :: a11y-prefix
One-line description
<markup with ${1:placeholders}>
```

`npm run build` generates the JSON files and the reference table above. `npm test` expands every snippet with its default values and validates the result: HTML with html-validate, CSS with css-tree, and JavaScript with Node's parser.

## License

[MIT](LICENSE)
