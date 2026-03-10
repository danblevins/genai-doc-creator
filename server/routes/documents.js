import { Router } from 'express';
import { renderDraft } from '../lib/templateEngine.js';
import { exportDocx } from '../lib/export.js';
import { getFakeData, getTemplateName } from '../lib/fakeData.js';
import { generateDocumentPayload } from '../lib/gemini.js';

const router = Router();

router.post('/draft', async (req, res) => {
  try {
    const { documentType, payload, useGemini } = req.body;
    if (!documentType) {
      return res.status(400).json({ error: 'documentType is required' });
    }
    let finalPayload;
    let templateName = documentType;
    if (useGemini) {
      templateName = getTemplateName(documentType);
      const fakeData = getFakeData(documentType);
      finalPayload = await generateDocumentPayload(templateName, fakeData);
    } else {
      if (!payload) {
        return res.status(400).json({ error: 'payload is required when useGemini is not set' });
      }
      finalPayload = payload;
    }
    const html = renderDraft(templateName, finalPayload);
    res.type('text/html').send(html);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to generate draft' });
  }
});

router.post('/export/docx', async (req, res) => {
  try {
    const { html } = req.body;
    if (!html) return res.status(400).json({ error: 'html is required' });
    const buffer = await exportDocx(html);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="document.docx"');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'DOCX export failed' });
  }
});

export default router;
