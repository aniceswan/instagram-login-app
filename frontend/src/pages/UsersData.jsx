import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/UsersData.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UsersData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="users-data-container">
      <div className="users-header">
        <div>
          <h1>📊 Data Users</h1>
          <p className="subtitle">All registered users</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="users-stats">
        <div className="stat-box">
          <div className="stat-number">{users.length}</div>
          <div className="stat-text">Total Users</div>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading users data...</div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <p>📭 Belum ada user yang mendaftar</p>
        </div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td className="name-cell">{user.name}</td>
                  <td className="email-cell">{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="delete-btn-small"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
