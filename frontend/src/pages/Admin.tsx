import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface Order {
  id: number;
  userId: number;
  total: number;
  status: string;
  createdAt: string;
  user: { email: string; name: string };
  items: { product: { name: string }; quantity: number; price: number }[];
}

interface Review {
  id: number;
  title: string;
  body: string;
  score: number;
  status: string;
  createdAt: string;
  user: { id: number; name: string; email: string };
  product: { id: number; name: string };
}

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  revenue: number;
}

export const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewFilter, setReviewFilter] = useState('pending');
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'orders' | 'users' | 'reviews'>('orders');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tab === 'reviews') {
      loadReviews();
    }
  }, [tab, reviewFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, ordersData, statsData] = await Promise.all([
        api.admin.getUsers(),
        api.admin.getOrders(),
        api.admin.getStats()
      ]);
      setUsers(usersData);
      setOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await api.admin.getReviews(reviewFilter);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error('Failed to load reviews', error);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.admin.updateOrderStatus(orderId, status);
      loadData();
    } catch (error) {
      console.error('Failed to update order', error);
    }
  };

  const handleApproveReview = async (reviewId: number) => {
    try {
      await api.admin.updateReviewStatus(reviewId, 'approved');
      loadReviews();
    } catch (error) {
      console.error('Failed to approve review', error);
    }
  };

  const handleRejectReview = async (reviewId: number) => {
    try {
      await api.admin.updateReviewStatus(reviewId, 'rejected');
      loadReviews();
    } catch (error) {
      console.error('Failed to reject review', error);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.admin.deleteReview(reviewId);
      loadReviews();
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded ${tab === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Orders</button>
        <button onClick={() => setTab('users')} className={`px-4 py-2 rounded ${tab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Users</button>
        <button onClick={() => setTab('reviews')} className={`px-4 py-2 rounded ${tab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Reviews</button>
      </div>

      {tab === 'orders' && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Total</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-2">#{order.id}</td>
                    <td className="p-2">{order.user.name} ({order.user.email})</td>
                    <td className="p-2">${order.total.toFixed(2)}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-t">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Reviews</h2>
          <div className="mb-4">
            <select
              value={reviewFilter}
              onChange={e => setReviewFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Score</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map(review => (
                  <tr key={review.id} className="border-t">
                    <td className="p-2">{review.id}</td>
                    <td className="p-2">{review.product.name}</td>
                    <td className="p-2">{review.user.name}</td>
                    <td className="p-2 max-w-xs truncate">{review.title}</td>
                    <td className="p-2">{review.score}/5</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        review.status === 'approved' ? 'bg-green-100 text-green-700' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="p-2 flex gap-1">
                      {review.status === 'pending' && (
                        <>
                          <button onClick={() => handleApproveReview(review.id)} className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700">Approve</button>
                          <button onClick={() => handleRejectReview(review.id)} className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700">Reject</button>
                        </>
                      )}
                      <button onClick={() => handleDeleteReview(review.id)} className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700">Delete</button>
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr><td colSpan={7} className="p-4 text-center text-gray-500">No reviews found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};