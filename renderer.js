/**
 * renderer.js
 * Shared JSON renderer used by both content.js and popup.js.
 * Exposes window.JSONFormatter = { render, collapseAll, expandAll }
 */
(function () {
  'use strict';

  function el(tag, className) {
    const e = document.createElement(tag);
    if (className) e.className = className;
    return e;
  }

  // ── Value dispatch ────────────────────────────────────────────────────────

  function renderValue(value, isLast) {
    if (value === null)            return renderNull(isLast);
    if (typeof value === 'boolean') return renderBoolean(value, isLast);
    if (typeof value === 'number')  return renderNumber(value, isLast);
    if (typeof value === 'string')  return renderString(value, isLast);
    if (Array.isArray(value))       return renderArray(value, isLast);
    return renderObject(value, isLast);
  }

  // ── Primitives ────────────────────────────────────────────────────────────

  function renderNull(isLast) {
    const span = el('span', 'jf-null');
    span.textContent = 'null';
    return maybeComma(span, isLast);
  }

  function renderBoolean(value, isLast) {
    const span = el('span', 'jf-boolean');
    span.textContent = String(value);
    return maybeComma(span, isLast);
  }

  function renderNumber(value, isLast) {
    const span = el('span', 'jf-number');
    span.textContent = String(value);
    return maybeComma(span, isLast);
  }

  function renderString(value, isLast) {
    const span = el('span', 'jf-string');
    // JSON.stringify correctly escapes backslashes, quotes, newlines, etc.
    span.textContent = JSON.stringify(value);
    return maybeComma(span, isLast);
  }

  function maybeComma(node, isLast) {
    if (isLast) return node;
    const wrapper = el('span');
    wrapper.appendChild(node);
    wrapper.appendChild(document.createTextNode(','));
    return wrapper;
  }

  // ── Object ────────────────────────────────────────────────────────────────

  function renderObject(obj, isLast) {
    const entries = Object.entries(obj);
    const summary = entries.length === 0
      ? null
      : entries.length + (entries.length === 1 ? ' key' : ' keys');

    return renderCollapsible('{', '}', summary, isLast, 'jf-object', function (container) {
      entries.forEach(function ([key, val], i) {
        const row = el('div', 'jf-row');
        const keySpan = el('span', 'jf-key');
        keySpan.textContent = JSON.stringify(key);
        row.appendChild(keySpan);
        row.appendChild(document.createTextNode(': '));
        row.appendChild(renderValue(val, i === entries.length - 1));
        container.appendChild(row);
      });
    });
  }

  // ── Array ─────────────────────────────────────────────────────────────────

  function renderArray(arr, isLast) {
    const summary = arr.length === 0
      ? null
      : arr.length + (arr.length === 1 ? ' item' : ' items');

    return renderCollapsible('[', ']', summary, isLast, 'jf-array', function (container) {
      arr.forEach(function (val, i) {
        const row = el('div', 'jf-row');
        row.appendChild(renderValue(val, i === arr.length - 1));
        container.appendChild(row);
      });
    });
  }

  // ── Collapsible wrapper ───────────────────────────────────────────────────

  function renderCollapsible(openChar, closeChar, summary, isLast, typeClass, populateFn) {
    const wrapper   = el('span', 'jf-node ' + typeClass);
    const toggle    = el('span', 'jf-toggle');
    const openBrace = el('span', 'jf-brace');
    const summaryEl = el('span', 'jf-summary');
    const children  = el('div',  'jf-children');
    const closeBrace = el('span', 'jf-brace');

    openBrace.textContent  = openChar;
    closeBrace.textContent = closeChar;

    wrapper.appendChild(toggle);
    wrapper.appendChild(openBrace);
    wrapper.appendChild(summaryEl);
    wrapper.appendChild(children);
    wrapper.appendChild(closeBrace);
    if (!isLast) wrapper.appendChild(document.createTextNode(','));

    // Empty object/array – no toggle
    if (!summary) {
      toggle.style.visibility = 'hidden';
      return wrapper;
    }

    summaryEl.textContent = summary;
    populateFn(children);

    // Start expanded
    summaryEl.style.display = 'none';
    toggle.textContent = '▼';
    toggle.title = 'Collapse';

    let collapsed = false;
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      collapsed = !collapsed;
      toggle.textContent        = collapsed ? '▶' : '▼';
      toggle.title              = collapsed ? 'Expand' : 'Collapse';
      children.style.display    = collapsed ? 'none' : '';
      summaryEl.style.display   = collapsed ? '' : 'none';
    });

    return wrapper;
  }

  // ── Public API ────────────────────────────────────────────────────────────

  function render(value) {
    const root = el('div', 'jf-root');
    root.appendChild(renderValue(value, true));
    return root;
  }

  function collapseAll(root) {
    root.querySelectorAll('.jf-node').forEach(function (node) {
      const toggle   = node.querySelector(':scope > .jf-toggle');
      const children = node.querySelector(':scope > .jf-children');
      const summary  = node.querySelector(':scope > .jf-summary');
      if (!toggle || toggle.style.visibility === 'hidden') return;
      toggle.textContent      = '▶';
      toggle.title            = 'Expand';
      children.style.display  = 'none';
      summary.style.display   = '';
    });
  }

  function expandAll(root) {
    root.querySelectorAll('.jf-node').forEach(function (node) {
      const toggle   = node.querySelector(':scope > .jf-toggle');
      const children = node.querySelector(':scope > .jf-children');
      const summary  = node.querySelector(':scope > .jf-summary');
      if (!toggle || toggle.style.visibility === 'hidden') return;
      toggle.textContent      = '▼';
      toggle.title            = 'Collapse';
      children.style.display  = '';
      summary.style.display   = 'none';
    });
  }

  window.JSONFormatter = { render, collapseAll, expandAll };
})();
