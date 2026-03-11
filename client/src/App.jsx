import { useState, useRef, useEffect } from 'react';
import DocumentTypeSelect from './components/DocumentTypeSelect';
import TwoPagerForm from './components/TwoPagerForm';
import QuarterlyReviewForm from './components/QuarterlyReviewForm';
import DraftPreview from './components/DraftPreview';
import CommentSidebar from './components/CommentSidebar';
import ExportButtons from './components/ExportButtons';
import GeneratingLogo from './components/GeneratingLogo';
import { generateDraft } from './api';
import './App.css';

export default function App() {
  const [step, setStep] = useState('select');
  const [documentType, setDocumentType] = useState(null);
  const [selectedDocTypeForAI, setSelectedDocTypeForAI] = useState(null);
  const [showManualTypeChoice, setShowManualTypeChoice] = useState(false);
  const [draftHtml, setDraftHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const previewRef = useRef(null);
  const draftStartRef = useRef(null);

  useEffect(() => {
    if (step === 'preview' && draftHtml) {
      draftStartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step, draftHtml]);

  function handleSelectType(type) {
    setDocumentType(type);
    setStep('form');
    setError(null);
  }

  async function handleGenerateWithAI(type) {
    setDocumentType(type);
    setLoading(true);
    setError(null);
    try {
      const html = await generateDraft(type, null, { useGemini: true });
      setDraftHtml(html);
      setStep('preview');
    } catch (err) {
      setError(err.message || 'AI generation failed');
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setStep('select');
    setDocumentType(null);
    setSelectedDocTypeForAI(null);
    setShowManualTypeChoice(false);
    setDraftHtml('');
    setComments([]);
    setError(null);
  }

  function handleAddComment(comment) {
    setComments((prev) => [...prev, comment]);
  }

  function handleDeleteComment(id) {
    setComments((prev) => prev.filter((c) => c.id !== id));
    const el = document.getElementById(`comment-${id}`);
    if (el) {
      const parent = el.parentNode;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    }
  }

  async function handleGenerate(payload) {
    setLoading(true);
    setError(null);
    try {
      const html = await generateDraft(documentType, payload);
      setDraftHtml(html);
      setStep('preview');
    } catch (err) {
      setError(err.message || 'Failed to generate draft');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'select') {
    return (
      <div className="app">
        <main className="app-main">
          <header className="app-header">
            <div className="app-header-brand">
              <h1>Create a document</h1>
              <p>Generate first-draft business documents in minutes.</p>
            </div>
          </header>
          <DocumentTypeSelect
          selectedId={selectedDocTypeForAI}
          onSelectRadio={setSelectedDocTypeForAI}
          onGenerateAI={handleGenerateWithAI}
          onFillFormManual={() => setShowManualTypeChoice(true)}
          onBackToAI={() => setShowManualTypeChoice(false)}
          showManualChoice={showManualTypeChoice}
          onSelectTypeForForm={handleSelectType}
          generating={loading}
        />
          {loading && <GeneratingLogo message="Generating your draft with AI…" />}
          {error && <div className="error" role="alert">{error}</div>}
        </main>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="app">
        <main className="app-main">
          <header className="app-header">
            <div className="app-header-brand">
              <h1>Fill in details</h1>
            </div>
          </header>
        {documentType === 'two-pager' && (
          <TwoPagerForm onSubmit={handleGenerate} onBack={handleBack} />
        )}
        {documentType === 'quarterly-review' && (
          <QuarterlyReviewForm onSubmit={handleGenerate} onBack={handleBack} />
        )}
          {loading && <GeneratingLogo message="Generating draft…" />}
          {error && <div className="error" role="alert">{error}</div>}
          <md-fab variant="primary" className="fab" onClick={handleBack} aria-label="Back to Home" title="Back to Home">
            <svg slot="icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true"><path d="M18 12.998h-5v5a1 1 0 01-2 0v-5H6a1 1 0 010-2h5v-5a1 1 0 012 0v5h5a1 1 0 010 2z"/></svg>
          </md-fab>
        </main>
      </div>
    );
  }

  return (
    <div className="app app--preview">
      <main className="app-main">
        <header className="app-header app-header--preview">
          <md-text-button onClick={handleBack} className="app-header-back">
            <span className="app-header-back-icon" aria-hidden="true">←</span>
            Back to Home
          </md-text-button>
          <div ref={draftStartRef} className="app-header-brand">
            <p className="doc-step-badge">Step 2 of 2</p>
            <h1>Your draft</h1>
          </div>
          <ExportButtons previewRef={previewRef} />
        </header>
        <div className="step-2-edit-callout" role="status">
          <span className="step-2-edit-callout-icon" aria-hidden="true">✎</span>
          <p className="step-2-edit-callout-text">
            <strong>You can edit the document below.</strong> Select text to highlight or add a comment in the sidebar. Use the buttons above to export as PDF or Word.
          </p>
        </div>
        <div className="step-2-draft-layout">
          <DraftPreview
            initialHtml={draftHtml}
            previewRef={previewRef}
            onAddComment={handleAddComment}
          />
          <CommentSidebar
            comments={comments}
            previewRef={previewRef}
            onDelete={handleDeleteComment}
          />
        </div>
        <div className="step-2-back-wrap">
          <md-filled-tonal-button onClick={handleBack} className="back-to-home-btn">
            <svg slot="icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            Back to Home
          </md-filled-tonal-button>
        </div>
      </main>
      <md-fab variant="primary" className="fab" onClick={handleBack} aria-label="Back to Home" title="Back to Home">
        <svg slot="icon" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true"><path d="M18 12.998h-5v5a1 1 0 01-2 0v-5H6a1 1 0 010-2h5v-5a1 1 0 012 0v5h5a1 1 0 010 2z"/></svg>
      </md-fab>
    </div>
  );
}
