/**
 * content.js
 * Detects pages that serve raw JSON and replaces them with a formatted view.
 * Works on:
 *   - application/json responses (API endpoints, .json files)
 *   - Pages whose <body> contains only a single <pre> with JSON text
 */
(function () {
  'use strict';

  // ── Detect raw JSON ───────────────────────────────────────────────────────

  function getRawJSON() {
    // Most reliable: check the MIME type Chrome received
    if (document.contentType === 'application/json' ||
        document.contentType === 'text/json') {
      const pre = document.querySelector('body > pre');
      return (pre ? pre.textContent : document.body.innerText).trim();
    }

    // Fallback: body contains only one <pre> that looks like JSON
    const bodyEls = Array.from(document.body.children).filter(function (e) {
      return e.tagName !== 'SCRIPT';
    });
    if (bodyEls.length === 1 && bodyEls[0].tagName === 'PRE') {
      const txt = bodyEls[0].textContent.trim();
      if (txt.startsWith('{') || txt.startsWith('[')) return txt;
    }

    return null;
  }

  const rawText = getRawJSON();
  if (!rawText) return;

  // ── Parse ─────────────────────────────────────────────────────────────────

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    return; // Not valid JSON – leave the page untouched
  }

  // ── Build the formatted page ──────────────────────────────────────────────

  // Reset the page
  document.documentElement.style.cssText = '';
  document.body.innerHTML = '';
  document.body.id = 'jf-body';
  document.title = decodeURIComponent(location.pathname.split('/').pop() || 'JSON') + ' – JSON Formatter';

  // Header bar
  const header = document.createElement('div');
  header.id = 'jf-header';

  const headerLeft = document.createElement('div');
  headerLeft.id = 'jf-header-left';
  const titleSpan = document.createElement('span');
  titleSpan.id = 'jf-title';
  titleSpan.textContent = 'JSON';
  const urlSpan = document.createElement('span');
  urlSpan.id = 'jf-url';
  urlSpan.textContent = location.href;
  headerLeft.appendChild(titleSpan);
  headerLeft.appendChild(urlSpan);

  const headerRight = document.createElement('div');
  headerRight.id = 'jf-header-right';

  function makeBtn(id, label) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.textContent = label;
    return btn;
  }

  const btnCollapse = makeBtn('jf-btn-collapse', 'Collapse All');
  const btnExpand   = makeBtn('jf-btn-expand',   'Expand All');
  const btnCopy     = makeBtn('jf-btn-copy',      'Copy JSON');

  headerRight.appendChild(btnCollapse);
  headerRight.appendChild(btnExpand);
  headerRight.appendChild(btnCopy);

  header.appendChild(headerLeft);
  header.appendChild(headerRight);

  // Output
  const output = document.createElement('div');
  output.id = 'jf-output';
  const rendered = window.JSONFormatter.render(parsed);
  output.appendChild(rendered);

  document.body.appendChild(header);
  document.body.appendChild(output);

  // ── Copy button ───────────────────────────────────────────────────────────

  btnCopy.addEventListener('click', function () {
    const formatted = JSON.stringify(parsed, null, 2);
    navigator.clipboard.writeText(formatted).then(function () {
      const orig = btnCopy.textContent;
      btnCopy.textContent = 'Copied!';
      btnCopy.classList.add('jf-copied');
      setTimeout(function () {
        btnCopy.textContent = orig;
        btnCopy.classList.remove('jf-copied');
      }, 2000);
    });
  });

  // ── Collapse / Expand all ─────────────────────────────────────────────────

  btnCollapse.addEventListener('click', function () {
    window.JSONFormatter.collapseAll(output);
  });

  btnExpand.addEventListener('click', function () {
    window.JSONFormatter.expandAll(output);
  });
})();
