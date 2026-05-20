import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import API from '../api';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const [books, setBooks]       = useState([]);
  const [search, setSearch]     = useState('');
  const [sortType, setSortType] = useState('none');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState({ title: '', author: '', year: '', price: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId]   = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search)   params.append('search', search);
      if (sortType !== 'none') params.append('sort', sortType);

      const res = await fetch(`${API}/api/books?${params}`, { credentials: 'include' });
      const data = await res.json();
      setBooks(data);
    } catch {
      setError('Failed to load books. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [search, sortType]);

  useEffect(() => {
    const timer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(timer);
  }, [fetchBooks]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      const res = await fetch(`${API}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: form.title,
          author: form.author,
          year: Number(form.year),
          price: Number(form.price),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message); return; }
      setForm({ title: '', author: '', year: '', price: '' });
      setShowForm(false);
      fetchBooks();
    } catch {
      setFormError('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      const res = await fetch(`${API}/api/books/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      fetchBooks();
    } catch {
      alert('Server error');
    }
  };

  const startEdit = (book) => {
    setEditId(book._id);
    setEditForm({ title: book.title, author: book.author, year: book.year, price: book.price });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/books/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: editForm.title,
          author: editForm.author,
          year: Number(editForm.year),
          price: Number(editForm.price),
        }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      setEditId(null);
      fetchBooks();
    } catch {
      alert('Server error');
    }
  };

  const isOwner = (book) => user && book.createdBy && book.createdBy._id === user.id;

  return (
    <div>
      <h1 className="title">Programming Books Library</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search book or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="none">No Sort</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>

        {user && (
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Cancel' : '+ Add Book'}
          </button>
        )}
      </div>

      {/* Add Book Form */}
      {showForm && (
        <form className="add-form" onSubmit={handleAdd}>
          <h3>Add New Book</h3>
          {formError && <p className="form-error">{formError}</p>}
          <div className="form-grid">
            <input placeholder="Title"  value={form.title}  onChange={e => setForm({...form, title: e.target.value})}  required />
            <input placeholder="Author" value={form.author} onChange={e => setForm({...form, author: e.target.value})} required />
            <input placeholder="Year"  type="number" value={form.year}  onChange={e => setForm({...form, year: e.target.value})}  required />
            <input placeholder="Price ($)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          </div>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Book'}
          </button>
        </form>
      )}

      {loading && <p className="status">Loading books...</p>}
      {error   && <p className="status error">{error}</p>}
      {!loading && !error && books.length === 0 && (
        <p className="status">No books found.</p>
      )}

      <div className="books">
        {books.map((book) => (
          <div className="card" key={book._id}>
            {editId === book._id ? (
              <form onSubmit={handleEdit} className="edit-form">
                <input value={editForm.title}  onChange={e => setEditForm({...editForm, title: e.target.value})}  required />
                <input value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})} required />
                <input value={editForm.year}   onChange={e => setEditForm({...editForm, year: e.target.value})}   type="number" required />
                <input value={editForm.price}  onChange={e => setEditForm({...editForm, price: e.target.value})}  type="number" required />
                <div className="card-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditId(null)} className="btn-cancel">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Year: {book.year}</p>
                <p>Price: ${book.price}</p>
                {book.createdBy && (
                  <p className="added-by">Added by: {book.createdBy.name}</p>
                )}
                {isOwner(book) && (
                  <div className="card-actions">
                    <button onClick={() => startEdit(book)}>Edit</button>
                    <button onClick={() => handleDelete(book._id)} className="btn-delete">Delete</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
