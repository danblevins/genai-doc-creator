const API = '/api';

export async function generateDraft(documentType, payload, options = {}) {
  const { useGemini } = options;
  const body = useGemini
    ? { documentType, useGemini: true }
    : { documentType, payload };
  const res = await fetch(`${API}/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to generate draft');
  }
  return res.text();
}

export async function exportDocx(html) {
  const res = await fetch(`${API}/export/docx`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'DOCX export failed');
  }
  return res.blob();
}
