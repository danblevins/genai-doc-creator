import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const MODEL = 'gemini-2.5-flash';

function stripJsonBlock(text) {
  if (!text || typeof text !== 'string') return text;
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  return match ? match[1].trim() : text.trim();
}

function buildPrompt(documentType, fakeData) {
  const contextStr = JSON.stringify(fakeData, null, 2);
  if (documentType === 'two-pager') {
    return `You are writing a business two-pager. Given the following context, output a single JSON object and nothing else.
Aim for approximately 500 words total across all sections (about 80–100 words per section).
Use this exact structure:
{
  "title": "string (document title, e.g. product or initiative name)",
  "sections": [
    { "title": "Executive summary", "content": "<p>...</p>" },
    { "title": "Problem / Opportunity", "content": "<p>...</p>" },
    { "title": "Solution / Approach", "content": "<p>...</p>" },
    { "title": "Key metrics", "content": "<p>...</p>" },
    { "title": "Ask / Next steps", "content": "<p>...</p>" }
  ]
}
Each "content" must be HTML using <p> for paragraphs. Write substantive paragraphs so the full document is roughly 500 words. Expand on the context with clear, professional detail.
Context:
${contextStr}`;
  }
  if (documentType === 'quarterly-review') {
    return `You are writing a quarterly business review. Given the following context, output a single JSON object and nothing else.
Aim for approximately 500 words total (highlights, challenges, priorities, and supportNeeded combined). Include 3–5 metrics from context.
Use this exact structure:
{
  "orgName": "string",
  "period": "string (e.g. Q1 2025)",
  "highlights": "<p>...</p> or multiple <p>...</p>",
  "metrics": [ { "metric": "string", "target": "string", "actual": "string", "note": "string" } ],
  "challenges": "<p>...</p>",
  "priorities": "<p>...</p>",
  "supportNeeded": "<p>...</p>"
}
Use <p> for paragraphs. Write substantive content so the full narrative (highlights, challenges, priorities, supportNeeded) is roughly 500 words. Expand on the context with clear, professional detail.
Context:
${contextStr}`;
  }
  throw new Error(`Unknown document type: ${documentType}`);
}

/**
 * Generate a document payload using Gemini. Returns an object in the shape expected by Handlebars templates.
 * @param {string} documentType - 'two-pager' | 'quarterly-review'
 * @param {object} fakeData - context from getFakeData(documentType)
 * @returns {Promise<object>} payload for renderDraft(documentType, payload)
 */
export async function generateDocumentPayload(documentType, fakeData) {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Add it to .env to use "Generate with AI".');
  }
  const ai = new GoogleGenAI({ apiKey });
  const prompt = buildPrompt(documentType, fakeData);
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  const raw = response?.text ?? response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!raw) {
    throw new Error('Gemini returned no text.');
  }
  const jsonStr = stripJsonBlock(raw);
  let payload;
  try {
    payload = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Gemini response was not valid JSON: ${e.message}`);
  }
  if (documentType === 'quarterly-review' && Array.isArray(payload.metrics) && payload.metrics.length === 0) {
    payload.metrics = [{ metric: '—', target: '—', actual: '—', note: '—' }];
  }
  return payload;
}
