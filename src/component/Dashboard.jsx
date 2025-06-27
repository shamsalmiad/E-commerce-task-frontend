import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiCall from '../utils/useApi';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await apiCall('GET', '/users');
        setUsers(res?.data || []);
      } catch (err) {
        setError(err?.message || 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-600">Dashboard</h2>
        </div>
        <nav className="p-4 space-y-2">
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700">Home</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700">Profile</a>
          <a href="#" className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700">Settings</a>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, <span className="text-blue-600">{user?.name || 'User'}</span> 🎉
        </h1>

        <h2 className="text-xl font-semibold mb-2">All Users</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="p-3 bg-white rounded shadow flex justify-between items-center"
              >
                <span>{u.name} ({u.email})</span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
