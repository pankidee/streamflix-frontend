export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {pages.map((p) => (
        <button
          key={p}
          className={p === currentPage ? 'page-btn active' : 'page-btn'}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}
      {currentPage < totalPages && (
        <button className="page-btn next-btn" onClick={() => onPageChange(currentPage + 1)}>
          Next →
        </button>
      )}
    </div>
  );
}