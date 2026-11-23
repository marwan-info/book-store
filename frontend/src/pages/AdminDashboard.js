import { useEffect, useState } from 'react';
import api from '../api';
import Pagination from '../components/Pagination';
import { imageUrl } from '../api';

const emptyForm = { title: '', author: '', description: '', price: '', stock: '', image_url: '' };

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cover, setCover] = useState(null);
  const [fileKey, setFileKey] = useState(0);

  const loadBooks = () =>
  api
    .get('/books', { params: { page, limit: 10 } })
    .then((res) => {
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages);
    })
    .catch(() => setError('Could not load books'));

useEffect(() => { loadBooks(); }, [page]);

const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (cover) data.append('cover', cover);

    if (editingId) await api.put(`/books/${editingId}`, data);
    else await api.post('/books', data);

    setForm(emptyForm);
    setCover(null);
    setFileKey((k) => k + 1);
    setEditingId(null);
    setError('');
    loadBooks();
  } catch (err) {
    setError(err.response?.data?.message || 'Save failed');
  }
};

const startEdit = (book) => {
  setEditingId(book.id);
  setForm({
    title: book.title, author: book.author, description: book.description || '',
    price: book.price, stock: book.stock, image_url: book.image_url || '',
  });
};

const handleDelete = async (id) => {
  if (!window.confirm('Delete this book?')) return;
  await api.delete(`/books/${id}`);
  loadBooks();
};



return (
  <div className='page'>
    <h2>Admin Dashboard</h2>
    {error && <p className='error'>{error}</p>}
    <form onSubmit={handleSubmit} className='admin-form panel'>
      <h3>{editingId ? 'Update book' : 'Add new book'}</h3>
      {(cover || form.image_url) && (
        <img
          className='preview'
          alt='Cover preview'
          src={cover ? URL.createObjectURL(cover) : imageUrl(form.image_url)}
        />
      )}
      <input name='title' placeholder='Title' required value={form.title} onChange={handleChange} />
      <input name='author' placeholder='Author' required value={form.author} onChange={handleChange} />
      <textarea name='description' placeholder='Description' value={form.description} onChange={handleChange} />
      <input name='price' type='number' step='0.01' placeholder='Price' required value={form.price} onChange={handleChange} />
      <input name='stock' type='number' placeholder='Stock' required value={form.stock} onChange={handleChange} />
      <input name='image_url' placeholder='Image URL' value={form.image_url} onChange={handleChange} />
      <label>Cover image (upload)</label>
      <input key={fileKey} type='file' accept='image/*'
        onChange={(e) => setCover(e.target.files[0])} />
      <div>
        <button type='submit'>{editingId ? 'Update' : 'Add'}</button>{' '}
        {editingId && (
          <button className='secondary' type='button' onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>
        )}
      </div>
    </form>

    <h3>All books</h3>
    <table>
      <thead>
        <tr><th>Cover</th><th>ID</th><th>Title</th><th>Author</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {books.map((b) => (
          <tr key={b.id}>
            <td>
              {b.image_url
                ? <img className='thumb' src={imageUrl(b.image_url)} alt='' />
                : '-'}
            </td>
            <td>{b.id}</td>
            <td>{b.title}</td>
            <td>{b.author}</td>
            <td>${Number(b.price).toFixed(2)}</td>
            <td>{b.stock}</td>
            <td>
              <button className='small' onClick={() => startEdit(b)}>Edit</button>{' '}
              <button className='danger small' onClick={() => handleDelete(b.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <Pagination page={page} totalPages={totalPages} onChange={setPage} />
  </div>
);

}