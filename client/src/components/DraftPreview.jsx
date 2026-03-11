import { useEffect, useRef, useState, useCallback } from 'react';

function getSnippet(range, maxLen = 60) {
  const text = range?.toString().trim() || '';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '…';
}

function wrapSelectionInSpan(previewEl, spanId = null, className = 'draft-highlight') {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !previewEl?.contains(sel.anchorNode)) return false;
  const range = sel.getRangeAt(0);
  if (range.collapsed) return false;

  const span = document.createElement('span');
  span.className = className;
  if (spanId) {
    span.id = spanId;
    span.setAttribute('data-comment-id', spanId);
  }
  try {
    range.surroundContents(span);
  } catch {
    try {
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    } catch {
      return false;
    }
  }
  sel.removeAllRanges();
  return true;
}

export default function DraftPreview({ initialHtml, previewRef, onAddComment }) {
  const lastInitialHtmlRef = useRef(null);
  const [selectionState, setSelectionState] = useState(null);
  const [commentInput, setCommentInput] = useState(null);
  const [commentDraft, setCommentDraft] = useState('');
  const containerRef = useRef(null);
  const savedRangeRef = useRef(null);

  useEffect(() => {
    if (previewRef?.current && initialHtml && initialHtml !== lastInitialHtmlRef.current) {
      previewRef.current.innerHTML = initialHtml;
      lastInitialHtmlRef.current = initialHtml;
    }
  }, [initialHtml, previewRef]);

  const updateSelectionState = useCallback(() => {
    const sel = window.getSelection();
    const ref = previewRef?.current;
    const modalOpen = !!commentInput;
    if (!ref || !sel || sel.rangeCount === 0) {
      if (!modalOpen) savedRangeRef.current = null;
      setSelectionState(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (range.collapsed || !ref.contains(sel.anchorNode)) {
      if (!modalOpen) savedRangeRef.current = null;
      setSelectionState(null);
      return;
    }
    // Store a clone so we still have the range after user moves mouse to click "Add comment"
    savedRangeRef.current = range.cloneRange();
    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    setSelectionState({
      rect,
      containerRect,
      snippet: getSnippet(range),
    });
  }, [previewRef, commentInput]);

  useEffect(() => {
    document.addEventListener('selectionchange', updateSelectionState);
    return () => document.removeEventListener('selectionchange', updateSelectionState);
  }, [updateSelectionState]);

  function handleHighlight() {
    if (!previewRef?.current) return;
    const sel = window.getSelection();
    if (sel?.rangeCount && !sel.getRangeAt(0).collapsed) {
      wrapSelectionInSpan(previewRef.current, null, 'draft-highlight');
    }
    setSelectionState(null);
  }

  function handleAddCommentClick() {
    // Use the range we saved when the selection was made; selection is often cleared when clicking the button
    if (!savedRangeRef.current || !selectionState) return;
    setCommentInput({
      snippet: selectionState.snippet,
      rect: selectionState.rect,
    });
    setCommentDraft('');
  }

  function handleCommentSubmit(text) {
    const value = (text ?? commentDraft).trim();
    if (!value || !previewRef?.current || !commentInput) return;
    const savedRange = savedRangeRef.current;
    if (!savedRange) {
      setCommentInput(null);
      setCommentDraft('');
      return;
    }
    const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const spanId = `comment-${id}`;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
    const success = wrapSelectionInSpan(previewRef.current, spanId, 'draft-highlight draft-comment-anchor');
    if (success && onAddComment) {
      onAddComment({
        id,
        spanId,
        text: value,
        snippet: commentInput.snippet,
      });
    }
    setCommentInput(null);
    setCommentDraft('');
    setSelectionState(null);
    savedRangeRef.current = null;
  }

  function handleCommentCancel() {
    setCommentInput(null);
    setCommentDraft('');
    savedRangeRef.current = null;
  }

  const showToolbar = selectionState && !commentInput;
  const toolbarRect = showToolbar ? selectionState.rect : null;

  return (
    <div ref={containerRef} className="draft-preview-wrap">
      <p className="draft-preview-label">Select text to highlight or add a comment</p>
      <div
        ref={previewRef}
        className="draft-preview doc-preview-print"
        contentEditable
        suppressContentEditableWarning
      />
      {showToolbar && (
        <div
          className="draft-selection-toolbar"
          style={{
            position: 'fixed',
            left: toolbarRect ? Math.min(toolbarRect.left, window.innerWidth - 220) : 0,
            top: toolbarRect ? toolbarRect.top - 48 : 0,
            zIndex: 1000,
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <md-filled-tonal-button onMouseDown={(e) => { e.preventDefault(); handleHighlight(); }}>
            Highlight
          </md-filled-tonal-button>
          <md-filled-button onMouseDown={(e) => { e.preventDefault(); handleAddCommentClick(); }}>
            Add comment
          </md-filled-button>
        </div>
      )}
      {commentInput && (
        <>
          <div
            className="draft-comment-backdrop"
            aria-hidden="true"
            onClick={handleCommentCancel}
          />
          <div className="draft-comment-input-wrap" role="dialog" aria-label="Add comment">
          <p className="draft-comment-input-snippet">“{commentInput.snippet}”</p>
          <textarea
            className="draft-comment-input"
            placeholder="Write a comment…"
            rows={3}
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCommentCancel();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit(commentDraft);
              }
            }}
          />
          <div className="draft-comment-input-actions">
            <md-text-button onClick={handleCommentCancel}>Cancel</md-text-button>
            <md-filled-button onClick={() => handleCommentSubmit(commentDraft)}>
              Save comment
            </md-filled-button>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
