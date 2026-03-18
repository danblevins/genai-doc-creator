import { renderDraft } from '../../server/lib/templateEngine.js';
import { getFakeData, getTemplateName } from '../../server/lib/fakeData.js';
import { generateDocumentPayload } from '../../server/lib/gemini.js';

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

  const { documentType, payload, useGemini } = body;

  if (!documentType) {
    return json(400, { error: 'documentType is required' });
  }

  let finalPayload;
  let templateName = documentType;

  try {
    if (useGemini) {
      templateName = getTemplateName(documentType);
      const fakeData = getFakeData(documentType);
      finalPayload = await generateDocumentPayload(templateName, fakeData);
    } else {
      if (!payload) {
        return json(400, { error: 'payload is required when useGemini is not set' });
      }
      finalPayload = payload;
    }

    const html = renderDraft(templateName, finalPayload);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: html,
    };
  } catch (err) {
    console.error(err);
    return json(500, { error: err.message || 'Failed to generate draft' });
  }
}
