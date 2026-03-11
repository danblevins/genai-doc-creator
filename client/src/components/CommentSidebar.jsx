export default function CommentSidebar({ comments, previewRef, onDelete }) {
  if (!comments?.length) {
    return (
      <aside className="comment-sidebar">
        <h3 className="comment-sidebar-title">Comments</h3>
        <p className="comment-sidebar-empty">Select text in the draft and use “Add comment” to add a note here.</p>
      </aside>
    );
  }

  function goTo(spanId) {
    const el = document.getElementById(spanId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.classList.add('draft-comment-anchor-pulse');
    setTimeout(() => el?.classList.remove('draft-comment-anchor-pulse'), 1200);
  }

  return (
    <aside className="comment-sidebar">
      <h3 className="comment-sidebar-title">Comments</h3>
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-snippet" title={c.snippet}>
              “{c.snippet}”
            </div>
            <p className="comment-text">{c.text}</p>
            <div className="comment-actions">
              <md-text-button onClick={() => goTo(c.spanId)}>Go to</md-text-button>
              {onDelete && (
                <md-text-button onClick={() => onDelete(c.id)} className="comment-delete">Delete</md-text-button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
