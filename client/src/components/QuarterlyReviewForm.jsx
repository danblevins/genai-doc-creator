import { useState } from 'react';

function toHtml(text) {
  if (!text?.trim()) return '<p></p>';
  return text
    .trim()
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('') || '<p></p>';
}

function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

export default function QuarterlyReviewForm({ onSubmit, onBack }) {
  const [period, setPeriod] = useState('');
  const [orgName, setOrgName] = useState('');
  const [highlights, setHighlights] = useState('');
  const [challenges, setChallenges] = useState('');
  const [priorities, setPriorities] = useState('');
  const [supportNeeded, setSupportNeeded] = useState('');
  const [metrics, setMetrics] = useState([{ metric: '', target: '', actual: '', note: '' }]);

  function addMetric() {
    setMetrics((m) => [...m, { metric: '', target: '', actual: '', note: '' }]);
  }

  function updateMetric(i, field, value) {
    setMetrics((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }

  function removeMetric(i) {
    if (metrics.length <= 1) return;
    setMetrics((m) => m.filter((_, j) => j !== i));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const filteredMetrics = metrics.filter((m) => m.metric.trim() || m.target.trim() || m.actual.trim());
    onSubmit({
      period: period || 'Q1 2025',
      orgName: orgName || 'Organization',
      highlights: toHtml(highlights),
      challenges: toHtml(challenges),
      priorities: toHtml(priorities),
      supportNeeded: toHtml(supportNeeded),
      metrics: filteredMetrics.length ? filteredMetrics : [{ metric: '—', target: '—', actual: '—', note: '—' }],
    });
  }

  return (
    <form className="doc-form quarterly-form" onSubmit={handleSubmit}>
      <button type="button" className="back" onClick={onBack}>
        ← Back
      </button>
      <h2>Quarterly / Monthly review</h2>
      <label>
        Period (e.g. Q1 2025, March 2025)
        <input
          type="text"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          placeholder="Q1 2025"
        />
      </label>
      <label>
        Organization / team name
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Organization"
        />
      </label>
      <label>
        Highlights / wins (one per line)
        <textarea
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          rows={4}
          placeholder="Win one&#10;Win two&#10;..."
        />
      </label>
      <fieldset>
        <legend>Key metrics</legend>
        {metrics.map((m, i) => (
          <div key={i} className="metric-row">
            <input
              placeholder="Metric"
              value={m.metric}
              onChange={(e) => updateMetric(i, 'metric', e.target.value)}
            />
            <input
              placeholder="Target"
              value={m.target}
              onChange={(e) => updateMetric(i, 'target', e.target.value)}
            />
            <input
              placeholder="Actual"
              value={m.actual}
              onChange={(e) => updateMetric(i, 'actual', e.target.value)}
            />
            <input
              placeholder="Note"
              value={m.note}
              onChange={(e) => updateMetric(i, 'note', e.target.value)}
            />
            <button type="button" onClick={() => removeMetric(i)} aria-label="Remove row">
              ×
            </button>
          </div>
        ))}
        <button type="button" onClick={addMetric}>+ Add metric</button>
      </fieldset>
      <label>
        Challenges / risks (one per line)
        <textarea
          value={challenges}
          onChange={(e) => setChallenges(e.target.value)}
          rows={3}
        />
      </label>
      <label>
        Priorities for next period (one per line)
        <textarea
          value={priorities}
          onChange={(e) => setPriorities(e.target.value)}
          rows={3}
        />
      </label>
      <label>
        Support needed (one per line)
        <textarea
          value={supportNeeded}
          onChange={(e) => setSupportNeeded(e.target.value)}
          rows={2}
        />
      </label>
      <button type="submit">Generate draft</button>
    </form>
  );
}
