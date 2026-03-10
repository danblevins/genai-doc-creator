import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, '..', 'templates');

Handlebars.registerHelper('nl2br', (text) => {
  if (text == null || text === '') return '';
  const escaped = Handlebars.escapeExpression(String(text));
  return new Handlebars.SafeString(escaped.replace(/\n/g, '<br>'));
});

Handlebars.registerHelper('eq', (a, b) => a === b);

function parseNum(str) {
  if (str == null || str === '') return 0;
  let s = String(str).replace(/[$,\s%]/g, '');
  const mult = s.match(/k$/i) ? 1000 : s.match(/m$/i) ? 1e6 : 1;
  s = s.replace(/k$/i, '').replace(/m$/i, '');
  const n = parseFloat(s, 10);
  return Number.isFinite(n) ? n * mult : 0;
}

Handlebars.registerHelper('parseNum', (str) => parseNum(str));

/** Return ratio 0-100 for bar width (actual/target), capped at 100. */
Handlebars.registerHelper('metricBarPct', (actual, target) => {
  const a = parseNum(actual);
  const t = parseNum(target);
  if (t <= 0) return 100;
  const pct = Math.round((a / t) * 100);
  return Math.min(100, Math.max(0, pct));
});

/** Average of metric bar percentages for an "overall" viz. */
Handlebars.registerHelper('averageBarPct', (metrics) => {
  if (!Array.isArray(metrics) || metrics.length === 0) return 0;
  let sum = 0;
  for (const m of metrics) {
    const a = parseNum(m.actual);
    const t = parseNum(m.target);
    if (t > 0) sum += Math.min(100, Math.max(0, (a / t) * 100));
    else sum += 100;
  }
  return Math.round(sum / metrics.length);
});

const templateCache = {};

function loadTemplate(name) {
  if (!templateCache[name]) {
    const filePath = path.join(templatesDir, `${name}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    templateCache[name] = Handlebars.compile(source);
  }
  return templateCache[name];
}

export function renderDraft(documentType, payload) {
  const template = loadTemplate(documentType);
  return template(payload);
}
