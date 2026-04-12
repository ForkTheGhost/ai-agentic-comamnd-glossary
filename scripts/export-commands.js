#!/usr/bin/env node
/**
 * export-commands.js
 *
 * Parses agentic-ai-complete-reference.md and emits commands.json — a
 * machine-readable representation of every command documented in the
 * Markdown tables.
 *
 * Zero dependencies. Run from the repo root:
 *   node scripts/export-commands.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SOURCE_FILE = path.join(REPO_ROOT, 'agentic-ai-complete-reference.md');
const OUTPUT_FILE = path.join(REPO_ROOT, 'commands.json');
const VERSION = '2026-04';

/**
 * Extract the display name from a raw table cell.
 * Part I commands are backticked: `/clear` or `/login` / `/logout`
 * Part II commands are bolded: **Spawn**
 * Some rows use plain text (e.g. "Agent Teams", "Agent SDK").
 */
function extractName(cell) {
  const trimmed = cell.trim();

  // Bold markdown: **Name**
  const boldMatch = trimmed.match(/^\*\*(.+?)\*\*$/);
  if (boldMatch) return boldMatch[1].trim();

  // Backticked, possibly with multiple backtick spans (e.g. "`/login` / `/logout`")
  if (trimmed.startsWith('`')) {
    // Collect backticked fragments joined by surrounding text, preserve original
    // but strip the backticks themselves for the canonical name.
    return trimmed.replace(/`/g, '').trim();
  }

  return trimmed;
}

/**
 * Pull the aliases out of a description if the trailing sentence starts with
 * "Alias:" or "Aliases:". Returns { description, aliases }.
 */
function extractAliases(description) {
  // Match "Alias:" or "Aliases:" followed by one or more backticked or plain
  // slash-commands. Greedy to the end of the description.
  const aliasRegex = /\s*Alias(?:es)?:\s*(.+?)\s*$/;
  const match = description.match(aliasRegex);
  if (!match) return { description: description.trim(), aliases: null };

  const aliasSegment = match[1];
  // Pull individual aliases — either backticked or whitespace-separated.
  const backticked = [...aliasSegment.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim());
  let aliases;
  if (backticked.length > 0) {
    aliases = backticked;
  } else {
    aliases = aliasSegment
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const cleaned = description.slice(0, match.index).replace(/\s+$/, '').trim();
  return { description: cleaned, aliases };
}

/**
 * Parse a single Markdown table row of the form:
 *   | cell1 | cell2 |
 * Returns [cell1, cell2] or null if not a data row.
 */
function parseTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null;
  // Backtick-aware split: a `|` inside `...` is part of a cell, not a delimiter.
  const parts = [];
  let buf = '';
  let inCode = false;
  for (let k = 0; k < trimmed.length; k++) {
    const ch = trimmed[k];
    if (ch === '`') { inCode = !inCode; buf += ch; continue; }
    if (ch === '|' && !inCode) { parts.push(buf); buf = ''; continue; }
    buf += ch;
  }
  parts.push(buf);
  return parts.slice(1, -1).map((c) => c.trim().replace(/\\\|/g, '|'));
}

/**
 * Returns true for a separator row like "|---|---|".
 */
function isSeparatorRow(cells) {
  return cells.every((c) => /^:?-+:?$/.test(c));
}

function parseMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const commands = [];

  let part = null; // 'I' | 'II' | null
  let section = null;
  let sectionNum = null; // Roman numeral for Part II sections (or null)
  let subsection = null; // e.g. "A. Plan Management"

  let inCodeFence = false;
  let inTable = false;
  let tableHeader = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Toggle fenced code blocks — ignore their contents entirely.
    if (/^```/.test(line.trim())) {
      inCodeFence = !inCodeFence;
      inTable = false;
      tableHeader = null;
      continue;
    }
    if (inCodeFence) continue;

    // Part heading: "## Part I: ..." or "## Part II: ..."
    const partMatch = line.match(/^##\s+Part\s+(I{1,3}|IV|V?I{0,3}):/);
    if (partMatch) {
      part = partMatch[1];
      section = null;
      sectionNum = null;
      subsection = null;
      inTable = false;
      tableHeader = null;
      continue;
    }

    // Section heading: ### ...
    if (line.startsWith('### ')) {
      const title = line.slice(4).trim();
      // Part II sections are prefixed with a Roman numeral + period, e.g. "I. Workflow Orchestration"
      const romanMatch = title.match(/^([IVX]+)\.\s+(.*)$/);
      if (romanMatch) {
        sectionNum = romanMatch[1];
        section = romanMatch[2].trim();
      } else {
        sectionNum = null;
        section = title;
      }
      subsection = null;
      inTable = false;
      tableHeader = null;
      continue;
    }

    // Subsection heading (Part II section IX): #### A. Plan Management
    if (line.startsWith('#### ')) {
      subsection = line.slice(5).trim();
      inTable = false;
      tableHeader = null;
      continue;
    }

    // Callout / blockquote lines — skip.
    if (line.trim().startsWith('>')) {
      inTable = false;
      tableHeader = null;
      continue;
    }

    // Horizontal rule resets table state but nothing else.
    if (/^---+\s*$/.test(line.trim())) {
      inTable = false;
      tableHeader = null;
      continue;
    }

    const row = parseTableRow(line);
    if (!row) {
      inTable = false;
      tableHeader = null;
      continue;
    }

    // Saw a pipe-delimited row.
    if (!inTable) {
      // This must be a header row (e.g. "| Command | Description |").
      tableHeader = row.map((c) => c.toLowerCase());
      inTable = true;
      continue;
    }

    // Second row of a table is the separator.
    if (isSeparatorRow(row)) continue;

    // Data row. Expect exactly two columns.
    if (row.length < 2) continue;

    const nameCell = row[0];
    const descCell = row.slice(1).join(' | ').trim();

    const name = extractName(nameCell);
    const { description, aliases } = extractAliases(descCell);

    // Build the entry per schema.
    const entry = { part };

    if (part === 'II' && sectionNum) {
      entry.section_num = sectionNum;
    }

    entry.section = section;

    if (subsection) {
      entry.subsection = subsection;
    }

    entry.name = name;
    entry.description = description;

    if (aliases && aliases.length > 0) {
      entry.aliases = aliases;
    }

    commands.push(entry);
  }

  return commands;
}

function main() {
  const md = fs.readFileSync(SOURCE_FILE, 'utf8');
  const commands = parseMarkdown(md);

  const output = {
    version: VERSION,
    source: 'agentic-ai-complete-reference.md',
    generated_at: new Date().toISOString(),
    commands,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2) + '\n', 'utf8');

  const partI = commands.filter((c) => c.part === 'I').length;
  const partII = commands.filter((c) => c.part === 'II').length;
  const withAliases = commands.filter((c) => c.aliases).length;

  process.stdout.write(
    `Wrote ${commands.length} commands to ${path.relative(REPO_ROOT, OUTPUT_FILE)} ` +
      `(Part I: ${partI}, Part II: ${partII}, with aliases: ${withAliases})\n`
  );
}

main();
