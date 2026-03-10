import { useState } from 'react';
import { exportDocx } from '../api';

export default function ExportButtons({ previewRef }) {
  const [exporting, setExporting] = useState(null);

  function getPreviewHtml() {
    const el = previewRef?.current;
    return el?.innerHTML ?? '';
  }

  function handlePrint() {
    const el = previewRef?.current;
    if (!el) return;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html><html><head><style>
        body { font-family: Georgia, serif; max-width: 8.5in; margin: 0 auto; padding: 0.75in; font-size: 12pt; color: #111; }
        .doc-title { font-size: 18pt; margin-bottom: 0.5em; }
        .doc-heading { font-size: 14pt; margin-top: 1em; margin-bottom: 0.25em; }
        .doc-section { margin-bottom: 1em; }
        .doc-table { width: 100%; border-collapse: collapse; margin: 0.5em 0; }
        .doc-table th, .doc-table td { border: 1px solid #333; padding: 6px 8px; text-align: left; }
        .doc-cover { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2in 0.75in; min-height: 0; }
        .doc-cover-title { font-size: 22pt; font-weight: 700; margin: 0 0 0.25em 0; }
        .doc-cover-subtitle { font-size: 11pt; color: #555; margin: 0; }
        .doc-cover-icon { width: 140px; height: auto; color: #2563eb; }
        .doc-cover-icon--chart { width: 160px; }
        .doc-cover-visual { margin-bottom: 1.5em; }
        .doc-page-break { display: block; height: 0; margin: 0; padding: 0; page-break-after: always; }
        .doc-section-header { display: flex; align-items: center; gap: 0.5em; margin-bottom: 0.35em; }
        .doc-section-icon { display: inline-flex; width: 24px; height: 24px; color: #2563eb; flex-shrink: 0; }
        .doc-section-icon svg { width: 100%; height: 100%; }
        .doc-metrics-viz { margin-bottom: 1em; padding: 0.75em; background: #f5f5f5; border-radius: 8px; border: 1px solid #ddd; }
        .doc-metrics-overall { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 0.5em; margin-bottom: 1em; padding-bottom: 1em; border-bottom: 1px solid #ddd; }
        .doc-metrics-overall-label { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #555; }
        .doc-metrics-overall-value { font-size: 0.8rem; font-weight: 600; color: #333; }
        .doc-metric-bar-track { height: 8px; background: #ddd; border-radius: 4px; overflow: hidden; }
        .doc-metric-bar-track--overall { height: 12px; }
        .doc-metric-bar-fill { height: 100%; min-width: 4px; background: #2563eb; border-radius: 4px; }
        .doc-metric-bar-fill--accent { background: linear-gradient(90deg, #2563eb, #6366f1); }
        .doc-metrics-chart { display: flex; flex-direction: column; gap: 0.5em; }
        .doc-metric-bar-row { display: grid; grid-template-columns: 100px 1fr 80px; align-items: center; gap: 0.5em; font-size: 0.8rem; }
        .doc-metric-bar-label { color: #444; }
        .doc-metric-bar-legend { color: #555; font-size: 0.75rem; text-align: right; }
      </style></head><body>${getPreviewHtml()}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 250);
  }

  async function handleDocx() {
    setExporting('docx');
    try {
      const html = getPreviewHtml();
      const blob = await exportDocx(html);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Export failed');
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="export-buttons">
      <button type="button" onClick={handlePrint}>
        Save as PDF
      </button>
      <button type="button" onClick={handleDocx} disabled={exporting === 'docx'}>
        {exporting === 'docx' ? 'Exporting…' : 'Download DOCX'}
      </button>
    </div>
  );
}
