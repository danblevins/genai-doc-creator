import { exportDocx } from '../../server/lib/export.js';

const json = (statusCode, data) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

export async function handler(event) {
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const { html } = body;

  if (!html) {
    return json(400, { error: 'html is required' });
  }

  try {
    const buffer = await exportDocx(html);
    const base64 = buffer.toString('base64');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="document.docx"',
      },
      body: base64,
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error(err);
    return json(500, { error: err.message || 'DOCX export failed' });
  }
}
