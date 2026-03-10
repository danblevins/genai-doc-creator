export default function GeneratingLogo({ message = 'Generating your draft…' }) {
  return (
    <div className="generating-overlay" role="status" aria-live="polite" aria-label={message}>
      <div className="generating-card">
        <div className="generating-glow" aria-hidden="true" />
        <div className="generating-logo">
          <div className="generating-doc">
            <svg viewBox="0 0 48 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="4" y="2" width="32" height="44" rx="2" stroke="currentColor" strokeWidth="2" fill="none" className="generating-doc-bg"/>
              <line x1="12" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.5" className="generating-line generating-line-1"/>
              <line x1="12" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" className="generating-line generating-line-2"/>
              <line x1="12" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="1.5" className="generating-line generating-line-3"/>
            </svg>
          </div>
          <div className="generating-sparkle" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" className="generating-sparkle-svg">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
        </div>
        <p className="generating-message">{message}</p>
        <div className="generating-dots">
          <span className="generating-dot" />
          <span className="generating-dot" />
          <span className="generating-dot" />
        </div>
      </div>
    </div>
  );
}
