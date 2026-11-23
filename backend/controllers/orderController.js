const db = require('../config/db');

exports.checkout = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [items] = await conn.query(
      `SELECT c.book_id, c.quantity, b.price, b.stock, b.title
       FROM cart_items c JOIN books b ON b.id = c.book_id
       WHERE c.user_id = ? FOR UPDATE`,
      [req.user.id]
    );
    if (!items.length) {
      await conn.rollback();
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    for (const item of items) {
      if (item.quantity > item.stock) {
        await conn.rollback();
        return res.status(400).json({ message: `Not enough stock for ${item.title}` });
      }
    }

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const [order] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [req.user.id, total]
    );

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order.insertId, item.book_id, item.quantity, item.price]
      );
      await conn.query('UPDATE books SET stock = stock - ? WHERE id = ?', [
        item.quantity, item.book_id,
      ]);
    }

    await conn.query('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
    await conn.commit();
    res.status(201).json({ message: 'Purchase completed', orderId: order.insertId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Checkout failed' });
  } finally {
    conn.release();
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.id, oi.quantity, oi.price, b.title
         FROM order_items oi JOIN books b ON b.id = oi.book_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};