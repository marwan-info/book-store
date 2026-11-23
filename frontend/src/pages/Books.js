import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { imageUrl } from '../api';


export default function Books() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/books', { params: { search, page, limit: 12 } })
      .then((res) => {
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages);
      })
      .catch(() => setMessage('Could not load books'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [search, page]);

  const addToCart = async (bookId, buyNow = false) => {
    if (!user) return navigate('/login');
    try {
      await api.post('/cart', { book_id: bookId, quantity: 1 });
      if (buyNow) return navigate('/cart');
      setMessage('Added to cart');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className='page'>
  <h2>Welcome to my Book Library store</h2>
  <input className='search' placeholder='Search by title or author' value={search}
    onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
  {message && <p className='message'>{message}</p>}
  <div className='books-grid'>
    {books.map((b) => (
      <div key={b.id} className='book-card'>
        <div className='cover-wrap'>
          {b.image_url ? (
            <img
              className='book-cover'
              src={imageUrl(b.image_url)}
              alt={b.title}
              loading='lazy'
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className='book-cover placeholder'>{b.title[0]}</div>
          )}
        </div>
          
          <div className='book-body'>
          <h3>{b.title}</h3>
          <p className='book-author'>by {b.author}</p>
          <p className='book-desc'>{b.description}</p>
          <span className='price'>${Number(b.price).toFixed(2)}</span>
          <p className={b.stock > 0 ? 'stock' : 'stock out'}>
            {b.stock > 0 ? `In stock: ${b.stock}` : 'Out of stock'}
          </p>
          {user?.role !== 'admin' && (
            <div className='card-actions'>
              <button disabled={b.stock === 0} onClick={() => addToCart(b.id)}>Add to Cart</button>
              <button className='secondary' disabled={b.stock === 0} onClick={() => addToCart(b.id, true)}>Buy Now</button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
  <Pagination page={page} totalPages={totalPages} onChange={setPage} />
</div>
  );
}