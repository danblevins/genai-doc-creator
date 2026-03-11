import { AI_DOCUMENT_OPTIONS } from '../documentOptions';

export default function DocumentTypeSelect({
  selectedId,
  onSelectRadio,
  onGenerateAI,
  onFillFormManual,
  onBackToAI,
  showManualChoice,
  onSelectTypeForForm,
  generating,
}) {
  if (showManualChoice) {
    return (
      <div className="doc-type-select">
        <md-outlined-card className="doc-type-card">
          <p className="doc-step-badge">Alternative path</p>
          <h2>Fill the form yourself</h2>
          <p className="doc-type-select-hint">
            Choose a document type and enter your own content. The app will build a draft from your inputs (no AI).
          </p>
          <div className="doc-type-buttons">
            <md-filled-button onClick={() => onSelectTypeForForm('two-pager')}>
              Two-pager
            </md-filled-button>
            <md-filled-button onClick={() => onSelectTypeForForm('quarterly-review')}>
              Quarterly / Monthly review
            </md-filled-button>
          </div>
          {onBackToAI && (
            <md-text-button onClick={onBackToAI} className="doc-type-fill-form-link">
              Use AI instead
            </md-text-button>
          )}
        </md-outlined-card>
      </div>
    );
  }

  return (
    <div className="doc-type-select">
      <md-outlined-card className="doc-type-card doc-type-card--ai">
        <p className="doc-step-badge">Step 1 of 2</p>
        <h2>Pick a sample document</h2>
        <p className="doc-type-ai-intro">
          Each option below uses <strong>fixed sample data</strong> (company, metrics, bullets). The AI will turn that into a full draft. After you generate, you can <strong>compare the description here to the output</strong> to see how it worked.
        </p>
        <div className="doc-how-it-works">
          <span className="doc-how-it-works-title">How it works:</span>
          <ol>
            <li>Select one sample below (read the context so you know what the AI sees).</li>
            <li>Click &quot;Generate draft with AI&quot; — you get an editable draft.</li>
            <li>Edit in the preview, then export as PDF or Word.</li>
          </ol>
        </div>
        <div className="doc-type-radios" role="radiogroup" aria-label="Sample document type">
          {AI_DOCUMENT_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className={`doc-type-radio ${selectedId === opt.id ? 'doc-type-radio--selected' : ''}`}
            >
              <label className="doc-type-radio-label-wrap" onClick={() => onSelectRadio(opt.id)}>
                <md-radio
                  name="docType"
                  value={opt.id}
                  checked={selectedId === opt.id}
                  onInput={() => onSelectRadio(opt.id)}
                />
                <span className="doc-type-radio-label">{opt.label}</span>
                <span className="doc-type-radio-summary">{opt.summary}</span>
                <span className="doc-type-radio-desc">{opt.description}</span>
              </label>
              {selectedId === opt.id && (
                <div className="doc-type-actions doc-type-actions--inline">
                  <md-filled-button
                    disabled={generating}
                    onClick={() => onGenerateAI(selectedId)}
                    className="doc-type-generate-ai"
                  >
                    {generating ? 'Generating…' : 'Generate draft with AI'}
                  </md-filled-button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="doc-type-fill-manual-wrap">
          <md-text-button onClick={onFillFormManual} className="doc-type-fill-form-link">
            Fill form manually
          </md-text-button>
        </div>
      </md-outlined-card>
    </div>
  );
}
