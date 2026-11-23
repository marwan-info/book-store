const db = require('../config/db');

exports.getCart = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.id, c.quantity, b.id AS book_id, b.title, b.price, b.stock
       FROM cart_items c JOIN books b ON b.id = c.book_id
       WHERE c.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { book_id, quantity = 1 } = req.body;
    const [books] = await db.query('SELECT stock FROM books WHERE id = ?', [book_id]);
    if (!books.length) return res.status(404).json({ message: 'Book not found' });

    const [existing] = await db.query(
      'SELECT quantity FROM cart_items WHERE user_id = ? AND book_id = ?',
      [req.user.id, book_id]
    );
    const newQty = (existing[0]?.quantity || 0) + Number(quantity);
    if (newQty > books[0].stock) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    await db.query(
      `INSERT INTO cart_items (user_id, book_id, quantity) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = ?`,
      [req.user.id, book_id, newQty, newQty]
    );
    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const quantity = Number(req.body.quantity);
    const [rows] = await db.query(
      `SELECT b.stock FROM cart_items c JOIN books b ON b.id = c.book_id
       WHERE c.id = ? AND c.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Cart item not found' });
    if (quantity < 1 || quantity > rows[0].stock) {
      return res.status(400).json({ message: 'Invalid quantity or not enough stock' });
    }
    await db.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [
      quantity, req.params.id, req.user.id,
    ]);
    res.json({ message: 'Cart updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    await db.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [
      req.params.id, req.user.id,
    ]);
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};