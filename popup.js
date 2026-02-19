/**
 * popup.js
 * Handles the extension popup: format, validate, copy formatted/minified JSON.
 */
(function () {
  'use strict';

  // ── Elements ──────────────────────────────────────────────────────────────

  const inputEl          = document.getElementById('json-input');
  const btnFormat        = document.getElementById('btn-format');
  const btnClear         = document.getElementById('btn-clear');
  const btnCollapse      = document.getElementById('btn-collapse');
  const btnExpand        = document.getElementById('btn-expand');
  const errorBanner      = document.getElementById('error-banner');
  const errorMsg         = document.getElementById('error-msg');
  const outputSection    = document.getElementById('output-section');
  const outputBadge      = document.getElementById('output-badge');
  const outputDetail     = document.getElementById('output-detail');
  const jsonOutput       = document.getElementById('json-output');
  const btnCopyJson      = document.getElementById('btn-copy-json');

  let lastParsed = null;

  // ── State helpers ─────────────────────────────────────────────────────────

  function showError(msg) {
    errorMsg.textContent = msg;
    errorBanner.classList.add('visible');
    inputEl.classList.add('has-error');
    outputSection.classList.remove('visible');
    btnCollapse.disabled = true;
    btnExpand.disabled   = true;
    lastParsed = null;
  }

  function clearError() {
    errorBanner.classList.remove('visible');
    inputEl.classList.remove('has-error');
  }

  function hideOutput() {
    outputSection.classList.remove('visible');
    btnCollapse.disabled = true;
    btnExpand.disabled   = true;
  }

  // ── Format ────────────────────────────────────────────────────────────────

  function format() {
    const raw = inputEl.value.trim();

    if (!raw) {
      clearError();
      hideOutput();
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      showError(e.message);
      return;
    }

    clearError();
    lastParsed = parsed;

    // Badge + detail text
    if (Array.isArray(parsed)) {
      outputBadge.textContent  = 'Array';
      outputDetail.textContent = parsed.length + (parsed.length === 1 ? ' item' : ' items');
    } else if (parsed !== null && typeof parsed === 'object') {
      const n = Object.keys(parsed).length;
      outputBadge.textContent  = 'Object';
      outputDetail.textContent = n + (n === 1 ? ' key' : ' keys');
    } else {
      outputBadge.textContent  = typeof parsed;
      outputDetail.textContent = '';
    }

    // Render tree
    jsonOutput.innerHTML = '';
    jsonOutput.appendChild(window.JSONFormatter.render(parsed));

    outputSection.classList.add('visible');
    btnCollapse.disabled = false;
    btnExpand.disabled   = false;
  }

  // ── Copy helper ───────────────────────────────────────────────────────────

  function copyText(btn, text) {
    navigator.clipboard.writeText(text).then(function () {
      const orig = btn.textContent;
      btn.textContent = '✓ Copied';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = orig;
        btn.classList.remove('copied');
      }, 2000);
    });
  }

  // ── Event listeners ───────────────────────────────────────────────────────

  btnFormat.addEventListener('click', format);

  // Ctrl/Cmd + Enter to format
  inputEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) format();
  });

  // Auto-format on paste after brief debounce
  let pasteTimer = null;
  inputEl.addEventListener('paste', function () {
    clearTimeout(pasteTimer);
    pasteTimer = setTimeout(format, 80);
  });

  btnClear.addEventListener('click', function () {
    inputEl.value = '';
    clearError();
    hideOutput();
    lastParsed = null;
    inputEl.focus();
  });

  btnCollapse.addEventListener('click', function () {
    window.JSONFormatter.collapseAll(jsonOutput);
  });

  btnExpand.addEventListener('click', function () {
    window.JSONFormatter.expandAll(jsonOutput);
  });

  btnCopyJson.addEventListener('click', function () {
    if (lastParsed === null) return;
    copyText(btnCopyJson, JSON.stringify(lastParsed, null, 2));
  });
})();
