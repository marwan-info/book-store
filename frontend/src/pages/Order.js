import { useEffect, useState } from 'react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className='page'>
      <h2>My Orders</h2>
      {orders.length === 0 && <p>No orders yet.</p>}
      {orders.map((o) => (
        <div key={o.id} className='panel order-card'>
          <strong>Order #{o.id}</strong> - {new Date(o.created_at).toLocaleString()}
          <ul>
            {o.items.map((i) => (
              <li key={i.id}>{i.title} x {i.quantity} (${Number(i.price).toFixed(2)})</li>
            ))}
          </ul>
          <strong>Total: ${Number(o.total).toFixed(2)}</strong>
        </div>
      ))}
    </div>
  );
}