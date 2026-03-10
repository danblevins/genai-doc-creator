import { useState } from 'react';

const DEFAULT_SECTIONS = [
  { title: 'Executive summary', content: '' },
  { title: 'Problem / Opportunity', content: '' },
  { title: 'Solution / Approach', content: '' },
  { title: 'Key metrics', content: '' },
  { title: 'Ask / Next steps', content: '' },
];

function toHtml(text) {
  if (!text?.trim()) return '';
  return text
    .trim()
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('');
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

export default function TwoPagerForm({ onSubmit, onBack }) {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

  function updateSection(i, field, value) {
    setSections((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title: title || 'Two-pager',
      sections: sections.map((s) => ({
        title: s.title,
        content: toHtml(s.content),
      })),
    });
  }

  return (
    <form className="doc-form two-pager-form" onSubmit={handleSubmit}>
      <button type="button" className="back" onClick={onBack}>
        ← Back
      </button>
      <h2>Two-pager</h2>
      <label>
        Document title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Two-pager"
        />
      </label>
      {sections.map((section, i) => (
        <fieldset key={i}>
          <label>
            Section title
            <input
              type="text"
              value={section.title}
              onChange={(e) => updateSection(i, 'title', e.target.value)}
            />
          </label>
          <label>
            Content (bullets or short paragraphs, one per line)
            <textarea
              value={section.content}
              onChange={(e) => updateSection(i, 'content', e.target.value)}
              rows={4}
              placeholder="Key point one&#10;Key point two&#10;..."
            />
          </label>
        </fieldset>
      ))}
      <button type="submit">Generate draft</button>
    </form>
  );
}
