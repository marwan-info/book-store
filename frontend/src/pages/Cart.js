import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadCart = () => api.get('/cart').then((res) => setItems(res.data));
  useEffect(() => { loadCart(); }, []);

  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${id}`, { quantity });
      loadCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update');
    }
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/${id}`);
    loadCart();
  };

  const checkout = async () => {
    try {
      await api.post('/orders/checkout');
      alert('Purchase completed!');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className='page'>
      <h2>Your Cart</h2>
      {error && <p className='error'>{error}</p>}
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <>
          <table>
            <thead>
              <tr><th>Book</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>${Number(i.price).toFixed(2)}</td>
                  <td>
                    <div className='small'>
                      <span className='qty'>
                        <button onClick={() => updateQty(i.id, i.quantity - 1)}>-</button>
                        {' '}{i.quantity}{' '}
                        <button onClick={() => updateQty(i.id, i.quantity + 1)}>+</button>
                      </span>
                    </div>
                    
                  </td>
                  <td>${(i.price * i.quantity).toFixed(2)}</td>
                  <td><button className='danger small' onClick={() => removeItem(i.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 className='cart-total'>Total: ${total.toFixed(2)}</h3>
          <button onClick={checkout}>Buy / Checkout</button>
        </>
      )}
    </div>
  );
}