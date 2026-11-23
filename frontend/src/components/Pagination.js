export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }

  return (
    <div className='pagination'>
      <button className='secondary small' disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`dots-${i}`} className='dots'>...</span>
        ) : (
          <button key={p} className={p === page ? 'active small' : 'secondary small'} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button className='secondary small' disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </div>
  );
}