import { useEffect } from 'react';

export default function DraftPreview({ initialHtml, previewRef }) {
  useEffect(() => {
    if (previewRef?.current && initialHtml) {
      previewRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml, previewRef]);

  return (
    <div className="draft-preview-wrap">
      <p className="draft-preview-label">Editing draft — click any text to edit</p>
      <div
        ref={previewRef}
        className="draft-preview doc-preview-print"
        contentEditable
        suppressContentEditableWarning
      />
    </div>
  );
}
