const db = require('../config/db');

exports.getBooks = async (req, res) => {
  try {
    const search = `%${req.query.search || ''}%`;
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);
    const offset = (page - 1) * limit;

    const [[{ total }]] = await db.query(
      'SELECT COUNT(*) AS total FROM books WHERE title LIKE ? OR author LIKE ?',
      [search, search]
    );
    const [books] = await db.query(
      'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?',
      [search, search, limit, offset]
    );

    res.json({ books, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBook = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Book not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, author, description, price, stock } = req.body;
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url || null;

    if (!title || !author || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Title, author, price and stock are required' });
    }
    const [result] = await db.query(
      'INSERT INTO books (title, author, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, description || null, price, stock, image_url]
    );
    res.status(201).json({ id: result.insertId, message: 'Book added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { title, author, description, price, stock } = req.body;
    const image_url = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.image_url || null;

    const [result] = await db.query(
      'UPDATE books SET title = ?, author = ?, description = ?, price = ?, stock = ?, image_url = ? WHERE id = ?',
      [title, author, description || null, price, stock, image_url, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (err) {
    // Books already part of an order cannot be deleted (foreign key on order_items)
    res.status(409).json({ message: 'Cannot delete a book that exists in past orders' });
  }
};