#!/usr/bin/env node
/**
 * Build script: converts agentic-ai-complete-reference.md into dist/index.html.
 *
 * Zero-dependency, bespoke parser. This is NOT a general markdown engine —
 * it is tuned to the one known source document. It reproduces the
 * hand-crafted dark-theme design from the original HTML (reverse-engineered
 * here into a template), adds anchor IDs on every section, and injects a
 * floating right-rail TOC.
 *
 * Usage: node scripts/build.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'agentic-ai-complete-reference.md');
const OUT_DIR = path.join(ROOT, 'dist');
const OUT = path.join(OUT_DIR, 'index.html');

// Section metadata: maps Part I section titles -> CSS class + icon + filter cat.
const PART_I_SECTIONS = {
  'Session Management':          { cls: 'session',    icon: '\u26A1',        cat: 'session',    tipTone: 'accent' },
  'Context & Information':       { cls: 'context',    icon: '\uD83D\uDCCA',  cat: 'context',    tipTone: 'blue'   },
  'Model & Mode Control':        { cls: 'model',      icon: '\uD83E\uDDE0',  cat: 'model',      tipTone: 'green'  },
  'Configuration & Permissions': { cls: 'config',     icon: '\u2699\uFE0F',  cat: 'config',     tipTone: 'orange' },
  'Extensions & Integrations':   { cls: 'extensions', icon: '\uD83D\uDD0C',  cat: 'extensions', tipTone: 'cyan'   },
  'Bundled Skills':              { cls: 'skills',     icon: '\uD83C\uDFAF',  cat: 'skills',     tipTone: 'cyan'   },
  'Multi-Agent & Orchestration': { cls: 'p1agents',   icon: '\uD83E\uDD16',  cat: 'p1agents',   tipTone: 'indigo' },
  'CLI Flags':                   { cls: 'cli',        icon: '\uD83D\uDEA9',  cat: 'cli',        tipTone: 'orange' },
  'Keyboard Shortcuts':          { cls: 'shortcuts',  icon: '\u2328\uFE0F',  cat: 'shortcuts',  tipTone: 'red'    },
  'Custom Skills & Commands':    { cls: 'custom',     icon: '\uD83D\uDEE0\uFE0F', cat: 'custom', tipTone: 'green' },
};

const PART_II_SECTIONS = {
  'I':    { cls: 'orchestration', icon: '\uD83D\uDD00',       cat: 'orchestration', tipTone: 'cyan'    },
  'II':   { cls: 'cognitive',     icon: '\uD83D\uDCAD',       cat: 'cognitive',     tipTone: 'indigo'  },
  'III':  { cls: 'qa',            icon: '\u2705',             cat: 'qa',            tipTone: 'red'     },
  'IV':   { cls: 'memory',        icon: '\uD83D\uDDC4\uFE0F', cat: 'memory',        tipTone: 'amber'   },
  'V':    { cls: 'toolenv',       icon: '\uD83D\uDD27',       cat: 'toolenv',       tipTone: 'green'   },
  'VI':   { cls: 'guardrails',    icon: '\uD83D\uDEE1\uFE0F', cat: 'guardrails',    tipTone: 'red'     },
  'VII':  { cls: 'output',        icon: '\uD83D\uDCE4',       cat: 'output',        tipTone: 'sky'     },
  'VIII': { cls: 'collaboration', icon: '\uD83E\uDD1D',       cat: 'collaboration', tipTone: 'fuchsia' },
  'IX':   { cls: 'foreman',       icon: '\uD83D\uDC77',       cat: 'foreman',       tipTone: 'amber'   },
  'X':    { cls: 'foreman',       icon: '\uD83D\uDD04',       cat: 'foreman',       tipTone: 'amber'   },
};

const FILTER_BUTTONS_P1 = [
  ['session',    'Session'], ['context', 'Context'], ['model', 'Model'],
  ['config',     'Config'],  ['extensions', 'Extend'], ['skills', 'Skills'],
  ['p1agents',   'Agents'],  ['cli', 'CLI'], ['shortcuts', 'Keys'], ['custom', 'Custom'],
];
const FILTER_BUTTONS_P2 = [
  ['orchestration', 'Orchestrate'], ['cognitive', 'Reason'], ['qa', 'QA'],
  ['memory', 'Memory'], ['toolenv', 'Tools'], ['guardrails', 'Guards'],
  ['output', 'Output'], ['collaboration', 'Collab'], ['foreman', 'Foreman'],
];

function slugify(str) {
  return str.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderInline(md) {
  const codeSpans = [];
  let out = md.replace(/`([^`]+)`/g, (_, code) => {
    codeSpans.push(code);
    return '\u0000CODE' + (codeSpans.length - 1) + '\u0000';
  });
  out = escapeHtml(out);
  out = out.replace(/\*\*([^*]+)\*\*/g, '$1');
  out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => '<code>' + escapeHtml(codeSpans[Number(i)]) + '</code>');
  return out;
}

function renderCmdName(md) {
  let s = md.replace(/\*\*([^*]+)\*\*/g, '$1').trim();
  const only = /^`([^`]+)`$/.exec(s);
  if (only) return escapeHtml(only[1]);
  return renderInline(s);
}

function parseTableRow(line) {
  let t = line.trim();
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split(/(?<!\\)\|/).map(c => c.replace(/\\\|/g, '|').trim());
}

function parse(md) {
  const lines = md.split(/\r?\n/);
  let i = 0;
  const n = lines.length;

  const doc = { header: null, parts: [] };
  let currentPart = null;
  let currentSection = null;
  let currentGroup = null;

  function flushGroup() {
    if (currentGroup && currentSection) currentSection.groups.push(currentGroup);
    currentGroup = null;
  }
  function flushSection() { flushGroup(); currentSection = null; }
  function startSection(s) { flushSection(); currentSection = s; currentPart.sections.push(s); }

  while (i < n && lines[i].trim() === '') i++;
  if (i < n && lines[i].startsWith('# ')) {
    const title = lines[i].slice(2).trim();
    i++;
    while (i < n && lines[i].trim() === '') i++;
    const bq = [];
    while (i < n && lines[i].startsWith('>')) {
      bq.push(lines[i].replace(/^>\s?/, ''));
      i++;
    }
    doc.header = { title, lines: bq.filter(l => l.trim() !== '') };
  }

  while (i < n) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '---' || trimmed === '') { i++; continue; }

    const partMatch = /^##\s+Part\s+(I{1,2}):\s*(.+)$/.exec(trimmed);
    if (partMatch) {
      flushSection();
      i++;
      let desc = '';
      while (i < n && lines[i].trim() === '') i++;
      if (i < n && !lines[i].startsWith('#') && lines[i].trim() !== '---') {
        desc = lines[i].trim();
        i++;
      }
      currentPart = { roman: partMatch[1], title: partMatch[2].trim(), desc, sections: [] };
      doc.parts.push(currentPart);
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const heading = trimmed.slice(4).trim();
      const p2 = /^([IVX]+)\.\s+(.+)$/.exec(heading);
      let section;
      if (p2 && currentPart && currentPart.roman === 'II') {
        section = { kind: 'p2', numeral: p2[1], title: p2[2], id: slugify(p2[2]), subtitle: '', groups: [] };
      } else if (currentPart && currentPart.roman === 'II') {
        // "Mapping Foreman Commands to Claude Code" -> merge into section X.
        const last = currentPart.sections[currentPart.sections.length - 1];
        if (last && last.numeral === 'X') {
          flushGroup();
          currentSection = last;
          currentSection._pendingLabel = heading;
          i++;
          continue;
        }
        section = { kind: 'p2', numeral: '', title: heading, id: slugify(heading), subtitle: '', groups: [] };
      } else {
        section = { kind: 'p1', title: heading, id: slugify(heading), subtitle: '', groups: [] };
      }
      startSection(section);
      i++;
      while (i < n && lines[i].trim() === '') i++;
      if (i < n) {
        const subt = /^\*([^*]+)\*$/.exec(lines[i].trim());
        if (subt) { section.subtitle = subt[1]; i++; }
      }
      continue;
    }

    if (trimmed.startsWith('#### ')) {
      const label = trimmed.slice(5).trim();
      flushGroup();
      if (currentSection) currentSection._pendingLabel = label;
      i++;
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushGroup();
      i++;
      const preLines = [];
      while (i < n && !lines[i].trim().startsWith('```')) { preLines.push(lines[i]); i++; }
      if (i < n) i++;
      if (currentSection) currentSection.groups.push({ kind: 'pre', content: preLines.join('\n') });
      continue;
    }

    if (trimmed.startsWith('>')) {
      const tipLines = [];
      while (i < n && lines[i].trim().startsWith('>')) {
        tipLines.push(lines[i].replace(/^>\s?/, '').trim());
        i++;
      }
      const tipText = tipLines.join(' ').replace(/\s+/g, ' ').trim();
      if (currentSection) {
        if (currentGroup && currentGroup.kind === 'table') {
          currentGroup.tip = tipText;
        } else {
          flushGroup();
          currentSection.groups.push({ kind: 'tip', text: tipText });
        }
      }
      continue;
    }

    if (trimmed.startsWith('|')) {
      if (/^\|\s*-+/.test(trimmed)) { i++; continue; }
      const cells = parseTableRow(line);
      if (!currentGroup || currentGroup.kind !== 'table') {
        flushGroup();
        currentGroup = {
          kind: 'table',
          label: currentSection && currentSection._pendingLabel,
          rows: [],
          _rowsStarted: false,
        };
        if (currentSection) currentSection._pendingLabel = null;
      }
      if (!currentGroup._rowsStarted) {
        currentGroup._rowsStarted = true; // skip header row
        i++;
        continue;
      }
      currentGroup.rows.push({ name: cells[0] || '', desc: cells[1] || '' });
      i++;
      continue;
    }

    if (/^\*.+\*$/.test(trimmed)) { i++; continue; }
    i++;
  }

  flushSection();
  return doc;
}

// Render the section-X ASCII box. Strips the outer box-drawing border the
// MD uses, but preserves the inner EXECUTE loop box. Amber-colors numbered
// step headings and italic-dims the "(loop until …)" tail.
function renderForemanPre(raw) {
  const rawLines = raw.split('\n');
  const kept = [];
  for (const line of rawLines) {
    const t = line.trim();
    // Drop the outermost top/bottom/side border lines.
    if (/^[\u250C\u2510\u2514\u2518\u2500\u251C\u2524]+$/.test(t)) continue;
    if (t === '\u2502') continue;
    if (/FOREMAN LIFECYCLE/.test(t)) continue;
    // Strip the leading outer "\u2502  " and trailing "  \u2502" padding.
    let s = line.replace(/^\u2502\s?\s?/, '').replace(/\s*\u2502\s*$/, '');
    kept.push(s);
  }
  while (kept.length && kept[0].trim() === '') kept.shift();
  while (kept.length && kept[kept.length - 1].trim() === '') kept.pop();

  const decorated = kept.map(line => {
    const m = /^(\d+\.\s+[A-Z]+)(\s*\(.*\))?(.*)$/.exec(line);
    if (m) {
      const head = m[1];
      const tail = m[2] || '';
      const rest = m[3] || '';
      const headSpan = '<span style="color:var(--amber);font-weight:700;">' + escapeHtml(head) + '</span>';
      const tailSpan = tail ? ' <span style="color:var(--text-dim);font-style:italic;">' + escapeHtml(tail.trim()) + '</span>' : '';
      return headSpan + tailSpan + escapeHtml(rest);
    }
    return escapeHtml(line);
  });

  return decorated.join('\n');
}

function renderRow(row) {
  return '    <div class="cmd-row"><div class="cmd-name">' + renderCmdName(row.name) +
         '</div><div class="cmd-desc">' + renderInline(row.desc) + '</div></div>';
}

function renderTip(text, tone, extraStyle) {
  const style = extraStyle ? ' style="' + extraStyle + '"' : '';
  return '  <div class="tip tip-' + tone + '"' + style + '>' + renderInline(text) + '</div>';
}

function renderSection(section, currentPart) {
  const meta = currentPart.roman === 'I'
    ? PART_I_SECTIONS[section.title]
    : PART_II_SECTIONS[section.numeral];
  if (!meta) throw new Error('No metadata for section "' + section.title + '" (numeral ' + (section.numeral || '-') + ')');

  const out = [];
  out.push('<div class="section s-' + meta.cls + '" data-cat="' + meta.cat + '" id="' + section.id + '">');
  out.push('  <div class="section-header">');
  out.push('    <div class="section-icon">' + meta.icon + '</div>');
  if (section.kind === 'p2' && section.numeral) {
    out.push('    <div class="section-num">' + section.numeral + '.</div>');
  }
  out.push('    <div class="section-title">' + escapeHtml(section.title) + '</div>');
  if (section.subtitle) {
    out.push('    <div class="section-subtitle">' + escapeHtml(section.subtitle) + '</div>');
  }
  out.push('  </div>');

  for (let gi = 0; gi < section.groups.length; gi++) {
    const group = section.groups[gi];
    const prev = section.groups[gi - 1];

    if (group.kind === 'pre') {
      out.push('  <div style="padding: 0.75rem; background: var(--surface); border-radius: 6px; border: 1px solid var(--border); font-family: var(--mono); font-size: 0.72rem; line-height: 1.7; color: var(--text-dim); overflow-x: auto; white-space: pre;">');
      out.push(renderForemanPre(group.content) + '</div>');
      continue;
    }
    if (group.kind === 'tip') {
      const extra = (prev && prev.kind === 'pre') ? 'margin-top: 0.75rem;' : '';
      out.push(renderTip(group.text, meta.tipTone, extra));
      continue;
    }
    if (group.kind === 'table') {
      if (group.label) {
        if (section.numeral === 'X') {
          // In the original HTML this label reads "Mapping to Claude Code" with margin-top.
          const label = group.label === 'Mapping Foreman Commands to Claude Code'
            ? 'Mapping to Claude Code'
            : group.label;
          out.push('  <div class="subsection-label" style="margin-top: 1rem;">' + escapeHtml(label) + '</div>');
        } else {
          out.push('  <div class="subsection-label">' + escapeHtml(group.label) + '</div>');
        }
      }
      out.push('  <div class="cmd-grid">');
      for (const row of group.rows) out.push(renderRow(row));
      out.push('  </div>');
      if (group.tip) out.push(renderTip(group.tip, meta.tipTone));
      continue;
    }
  }

  out.push('</div>');
  return out.join('\n');
}

function renderPartDivider(part) {
  const r = part.roman;
  const cls = r === 'I' ? 'part-divider-i' : 'part-divider-ii';
  const labelCls = r === 'I' ? 'part-label-i' : 'part-label-ii';
  return [
    '<div class="part-divider ' + cls + '" data-cat="all">',
    '  <span class="part-label ' + labelCls + '">Part ' + r + '</span>',
    '  <span class="part-title">' + escapeHtml(part.title) + '</span>',
    '  <span class="part-desc">' + escapeHtml(part.desc) + '</span>',
    '</div>',
  ].join('\n');
}

function renderFilterBar() {
  const b = [];
  b.push('  <div class="filter-group">');
  b.push('    <button class="filter-btn active" data-filter="all">All</button>');
  b.push('  </div>');
  b.push('  <div class="filter-sep"></div>');
  b.push('  <div class="filter-group">');
  for (const [cat, label] of FILTER_BUTTONS_P1) {
    b.push('    <button class="filter-btn" data-filter="' + cat + '">' + label + '</button>');
  }
  b.push('  </div>');
  b.push('  <div class="filter-sep"></div>');
  b.push('  <div class="filter-group">');
  for (const [cat, label] of FILTER_BUTTONS_P2) {
    b.push('    <button class="filter-btn part-ii-btn" data-filter="' + cat + '">' + label + '</button>');
  }
  b.push('  </div>');
  return '<div class="filter-bar">\n' + b.join('\n') + '\n</div>';
}

function renderToc(doc) {
  const items = [];
  items.push('  <div class="toc-title">On this page</div>');
  for (const part of doc.parts) {
    items.push('  <div class="toc-part">Part ' + part.roman + '</div>');
    items.push('  <ul class="toc-list">');
    for (const s of part.sections) {
      const label = (s.kind === 'p2' && s.numeral) ? s.numeral + '. ' + s.title : s.title;
      items.push('    <li><a href="#' + s.id + '">' + escapeHtml(label) + '</a></li>');
    }
    items.push('  </ul>');
  }
  return '<nav class="toc" aria-label="Table of contents">\n' + items.join('\n') +
         '\n</nav>\n<button class="toc-toggle" aria-label="Toggle table of contents" type="button">\u2630</button>';
}

function render(doc) {
  const headerTitle = doc.header && doc.header.title;
  const subtitleLines = doc.header
    ? doc.header.lines.filter(l => !/^April\s+\d{4}$/i.test(l.trim())).slice(0, 2)
    : [];
  const date = (doc.header && doc.header.lines.find(l => /^April\s+\d{4}$/i.test(l.trim()))) || 'April 2026';

  const parts = doc.parts.map(part => {
    const secs = part.sections.map(s => renderSection(s, part)).join('\n\n');
    const comment = part.roman === 'I'
      ? '<!-- PART I: CLAUDE CODE PRACTICAL COMMANDS -->'
      : '<!-- PART II: AI AGENT COMMAND GLOSSARY -->';
    return comment + '\n\n' + renderPartDivider(part) + '\n\n' + secs;
  }).join('\n\n');

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<title>' + escapeHtml(headerTitle || 'Agentic AI \u2014 Complete Command Reference') + '</title>',
    '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">',
    '<style>',
    CSS,
    '</style>',
    '</head>',
    '<body>',
    '<div class="container">',
    '',
    '<header>',
    '  <h1>' + escapeHtml(headerTitle) + '</h1>',
    '  <p>' + subtitleLines.map(escapeHtml).join('<br>') + '</p>',
    '</header>',
    '',
    renderFilterBar(),
    '',
    parts,
    '',
    '<footer>',
    '  ' + escapeHtml(headerTitle) + ' \u00B7 ' + escapeHtml(date) + '<br>',
    '  Part I: code.claude.com, Anthropic docs \u00B7 Part II: Universal agent patterns',
    '</footer>',
    '',
    '</div>',
    '',
    renderToc(doc),
    '',
    '<script>',
    SCRIPT_JS,
    '</script>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

// ────────────────────────────────────────────────────────────────────────
// CSS (verbatim from the reference HTML, plus TOC + scroll-margin additions)
// ────────────────────────────────────────────────────────────────────────
const CSS = `  :root {
    --bg: #0c0e13;
    --surface: #14171e;
    --surface-hover: #1a1e28;
    --border: #252a36;
    --border-bright: #3a4155;
    --text: #e2e4ea;
    --text-dim: #8891a5;
    --accent: #c78fff;
    --accent-dim: rgba(199,143,255,0.12);
    --green: #5ceba0;
    --green-dim: rgba(92,235,160,0.1);
    --blue: #6cb4ff;
    --blue-dim: rgba(108,180,255,0.1);
    --orange: #ffaa5c;
    --orange-dim: rgba(255,170,92,0.1);
    --red: #ff6b7a;
    --red-dim: rgba(255,107,122,0.1);
    --cyan: #5ce8e8;
    --cyan-dim: rgba(92,232,232,0.1);
    --yellow: #ffe066;
    --yellow-dim: rgba(255,224,102,0.1);
    --pink: #ff7eb3;
    --pink-dim: rgba(255,126,179,0.1);
    --teal: #4dd4ac;
    --teal-dim: rgba(77,212,172,0.1);
    --indigo: #a78bfa;
    --indigo-dim: rgba(167,139,250,0.1);
    --lime: #b8e663;
    --lime-dim: rgba(184,230,99,0.1);
    --rose: #fb7185;
    --rose-dim: rgba(251,113,133,0.1);
    --sky: #38bdf8;
    --sky-dim: rgba(56,189,248,0.1);
    --amber: #fbbf24;
    --amber-dim: rgba(251,191,36,0.1);
    --fuchsia: #d946ef;
    --fuchsia-dim: rgba(217,70,239,0.1);
    --mono: 'JetBrains Mono', monospace;
    --sans: 'DM Sans', system-ui, sans-serif;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; scroll-padding-top: 90px; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    line-height: 1.6;
    padding: 2rem 1.5rem;
    padding-right: 240px; /* reserve gutter for fixed TOC */
  }

  .container { max-width: 1200px; margin: 0 auto; }

  header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }

  header h1 {
    font-family: var(--mono);
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, var(--accent), var(--blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
  }

  header p {
    color: var(--text-dim);
    font-size: 0.95rem;
    max-width: 700px;
    margin: 0 auto;
  }

  .part-divider {
    margin: 2.5rem 0 1.5rem;
    padding: 1rem 1.25rem;
    border-radius: 8px;
    border: 1px solid var(--border-bright);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .part-divider-i { background: linear-gradient(135deg, rgba(199,143,255,0.06), rgba(108,180,255,0.06)); }
  .part-divider-ii { background: linear-gradient(135deg, rgba(92,232,232,0.06), rgba(92,235,160,0.06)); }

  .part-label {
    font-family: var(--mono);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .part-label-i { background: var(--accent-dim); color: var(--accent); }
  .part-label-ii { background: var(--cyan-dim); color: var(--cyan); }

  .part-title { font-family: var(--mono); font-size: 1rem; font-weight: 700; }
  .part-desc { color: var(--text-dim); font-size: 0.82rem; margin-left: auto; }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
    margin-bottom: 2rem;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg);
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--border);
  }

  .filter-group { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; }
  .filter-sep { width: 1px; height: 20px; background: var(--border-bright); margin: 0 0.3rem; }

  .filter-btn {
    font-family: var(--mono);
    font-size: 0.68rem;
    font-weight: 600;
    padding: 0.35rem 0.7rem;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-dim);
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .filter-btn:hover { border-color: var(--accent); color: var(--text); }
  .filter-btn.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent); }
  .filter-btn.part-ii-btn.active { background: var(--cyan-dim); border-color: var(--cyan); color: var(--cyan); }
  .filter-btn.part-ii-btn:hover { border-color: var(--cyan); }

  .section { margin-bottom: 2rem; animation: fadeIn 0.3s ease; scroll-margin-top: 90px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border);
  }

  .section-icon {
    width: 30px; height: 30px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.95rem; flex-shrink: 0;
  }

  .section-title { font-family: var(--mono); font-size: 0.95rem; font-weight: 700; letter-spacing: -0.02em; }
  .section-num { font-family: var(--mono); font-size: 0.65rem; font-weight: 700; color: var(--text-dim); opacity: 0.6; margin-right: -0.25rem; }
  .section-subtitle { font-size: 0.78rem; color: var(--text-dim); margin-left: auto; font-family: var(--mono); }

  .cmd-grid { display: flex; flex-direction: column; gap: 1px; }
  .cmd-row {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.25rem;
    padding: 0.5rem 0.75rem;
    border-radius: 5px;
    transition: background 0.15s;
  }
  .cmd-row:hover { background: var(--surface-hover); }
  .cmd-name { font-family: var(--mono); font-size: 0.8rem; font-weight: 600; white-space: nowrap; }
  .cmd-desc { font-size: 0.82rem; color: var(--text-dim); line-height: 1.5; }
  .cmd-desc code {
    font-family: var(--mono); font-size: 0.75rem;
    background: var(--surface); padding: 0.1em 0.35em;
    border-radius: 3px; border: 1px solid var(--border); color: var(--text);
  }

  .s-session .section-icon { background: var(--accent-dim); color: var(--accent); }
  .s-session .cmd-name { color: var(--accent); }
  .s-context .section-icon { background: var(--blue-dim); color: var(--blue); }
  .s-context .cmd-name { color: var(--blue); }
  .s-model .section-icon { background: var(--green-dim); color: var(--green); }
  .s-model .cmd-name { color: var(--green); }
  .s-config .section-icon { background: var(--orange-dim); color: var(--orange); }
  .s-config .cmd-name { color: var(--orange); }
  .s-extensions .section-icon { background: var(--cyan-dim); color: var(--cyan); }
  .s-extensions .cmd-name { color: var(--cyan); }
  .s-skills .section-icon { background: var(--pink-dim); color: var(--pink); }
  .s-skills .cmd-name { color: var(--pink); }
  .s-p1agents .section-icon { background: var(--indigo-dim); color: var(--indigo); }
  .s-p1agents .cmd-name { color: var(--indigo); }
  .s-cli .section-icon { background: var(--yellow-dim); color: var(--yellow); }
  .s-cli .cmd-name { color: var(--yellow); }
  .s-shortcuts .section-icon { background: var(--red-dim); color: var(--red); }
  .s-shortcuts .cmd-name { color: var(--red); }
  .s-custom .section-icon { background: var(--teal-dim); color: var(--teal); }
  .s-custom .cmd-name { color: var(--teal); }

  .s-orchestration .section-icon { background: var(--cyan-dim); color: var(--cyan); }
  .s-orchestration .cmd-name { color: var(--cyan); }
  .s-cognitive .section-icon { background: var(--indigo-dim); color: var(--indigo); }
  .s-cognitive .cmd-name { color: var(--indigo); }
  .s-qa .section-icon { background: var(--rose-dim); color: var(--rose); }
  .s-qa .cmd-name { color: var(--rose); }
  .s-memory .section-icon { background: var(--amber-dim); color: var(--amber); }
  .s-memory .cmd-name { color: var(--amber); }
  .s-toolenv .section-icon { background: var(--green-dim); color: var(--green); }
  .s-toolenv .cmd-name { color: var(--green); }
  .s-guardrails .section-icon { background: var(--red-dim); color: var(--red); }
  .s-guardrails .cmd-name { color: var(--red); }
  .s-output .section-icon { background: var(--sky-dim); color: var(--sky); }
  .s-output .cmd-name { color: var(--sky); }
  .s-collaboration .section-icon { background: var(--fuchsia-dim); color: var(--fuchsia); }
  .s-collaboration .cmd-name { color: var(--fuchsia); }

  .s-foreman .section-icon { background: linear-gradient(135deg, var(--amber-dim), var(--orange-dim)); color: var(--amber); }
  .s-foreman .cmd-name { color: var(--amber); }
  .s-foreman .section-header { border-bottom: 1px solid rgba(251,191,36,0.2); }

  .subsection-label {
    font-family: var(--mono);
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--amber);
    padding: 0.75rem 0.75rem 0.25rem;
    opacity: 0.7;
  }

  .tip {
    margin-top: 0.6rem; padding: 0.55rem 0.85rem;
    border-radius: 5px; font-size: 0.78rem; line-height: 1.55; border-left: 3px solid;
  }
  .tip code {
    font-family: var(--mono); font-size: 0.75rem;
    background: rgba(255,255,255,0.06); padding: 0.1em 0.3em; border-radius: 3px;
  }
  .tip-accent { background: var(--accent-dim); border-color: var(--accent); }
  .tip-green { background: var(--green-dim); border-color: var(--green); }
  .tip-blue { background: var(--blue-dim); border-color: var(--blue); }
  .tip-orange { background: var(--orange-dim); border-color: var(--orange); }
  .tip-cyan { background: var(--cyan-dim); border-color: var(--cyan); }
  .tip-red { background: var(--red-dim); border-color: var(--red); }
  .tip-indigo { background: var(--indigo-dim); border-color: var(--indigo); }
  .tip-sky { background: var(--sky-dim); border-color: var(--sky); }
  .tip-fuchsia { background: var(--fuchsia-dim); border-color: var(--fuchsia); }
  .tip-amber { background: var(--amber-dim); border-color: var(--amber); }

  .toc {
    position: fixed;
    top: 90px;
    right: 1rem;
    width: 200px;
    max-height: calc(100vh - 120px);
    overflow-y: auto;
    padding: 0.85rem 0.9rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-size: 0.72rem;
    z-index: 5;
    transition: transform 0.25s ease, opacity 0.2s ease;
  }
  .toc-title {
    font-family: var(--mono);
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-dim);
    margin-bottom: 0.5rem;
  }
  .toc-part {
    font-family: var(--mono);
    font-size: 0.6rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--accent);
    margin: 0.65rem 0 0.3rem;
    opacity: 0.75;
  }
  .toc-list { list-style: none; display: flex; flex-direction: column; gap: 0.18rem; border-left: 1px solid var(--border); padding-left: 0.55rem; }
  .toc-list a {
    color: var(--text-dim);
    text-decoration: none;
    font-family: var(--mono);
    font-size: 0.68rem;
    line-height: 1.45;
    display: block;
    padding: 0.12rem 0.3rem;
    border-radius: 3px;
    border-left: 2px solid transparent;
    margin-left: -0.55rem;
    padding-left: 0.5rem;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
  }
  .toc-list a:hover { color: var(--text); background: var(--surface-hover); }
  .toc-list a.active {
    color: var(--accent);
    border-left-color: var(--accent);
    background: var(--accent-dim);
  }
  .toc-toggle {
    display: none;
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    border: 1px solid var(--border-bright);
    background: var(--surface);
    color: var(--text);
    font-size: 1.1rem;
    cursor: pointer;
    z-index: 6;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  }

  @media (max-width: 1100px) {
    body { padding-right: 1.5rem; } /* release gutter; TOC becomes drawer */
    .toc {
      transform: translateX(calc(100% + 1.5rem));
      opacity: 0;
      pointer-events: none;
    }
    .toc.open {
      transform: translateX(0);
      opacity: 1;
      pointer-events: auto;
    }
    .toc-toggle { display: flex; align-items: center; justify-content: center; }
  }

  @media (max-width: 700px) {
    .cmd-row { grid-template-columns: 1fr; gap: 0.15rem; }
    .section-subtitle, .part-desc { display: none; }
    header h1 { font-size: 1.4rem; }
    .filter-bar { gap: 0.3rem; }
    .filter-btn { font-size: 0.62rem; padding: 0.25rem 0.5rem; }
    .filter-sep { display: none; }
  }

  @media print {
    body { background: #fff; color: #111; padding: 0.5cm; font-size: 11px; }
    .filter-bar, .toc, .toc-toggle { display: none; }
    .cmd-row:hover { background: none; }
    .section { break-inside: avoid; margin-bottom: 1rem; }
    .part-divider { break-before: page; }
    .tip { border-left: 2px solid #999; background: #f5f5f5; }
    header h1 { -webkit-text-fill-color: #111; background: none; }
  }

  footer {
    text-align: center; margin-top: 2.5rem; padding-top: 1.25rem;
    border-top: 1px solid var(--border); color: var(--text-dim);
    font-size: 0.75rem; font-family: var(--mono);
  }`;

// Client-side JS: preserved filter-bar behavior + TOC scrollspy & drawer.
const SCRIPT_JS = `  document.querySelectorAll('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;
      document.querySelectorAll('.section').forEach(function (s) {
        s.style.display = (filter === 'all' || s.dataset.cat === filter) ? '' : 'none';
      });
      document.querySelectorAll('.part-divider').forEach(function (d) {
        d.style.display = (filter === 'all') ? '' : 'none';
      });
    });
  });

  (function () {
    var toc = document.querySelector('.toc');
    var toggle = document.querySelector('.toc-toggle');
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc-list a'));
    var targets = links.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      return el ? { a: a, el: el } : null;
    }).filter(Boolean);

    if (toggle && toc) {
      toggle.addEventListener('click', function () { toc.classList.toggle('open'); });
    }
    links.forEach(function (a) {
      a.addEventListener('click', function () { if (toc) toc.classList.remove('open'); });
    });

    function onScroll() {
      var y = window.scrollY + 120;
      var current = targets[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el.offsetTop <= y) current = targets[i];
        else break;
      }
      links.forEach(function (a) { a.classList.remove('active'); });
      if (current) current.a.classList.add('active');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();`;

function main() {
  const md = fs.readFileSync(SRC, 'utf8');
  const doc = parse(md);
  const html = render(doc);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT, html, 'utf8');
  var sectionCount = doc.parts.reduce(function (n, p) { return n + p.sections.length; }, 0);
  process.stdout.write('Wrote ' + path.relative(ROOT, OUT) + ' (' + html.length.toLocaleString() + ' bytes, ' + sectionCount + ' sections)\n');
}

main();
