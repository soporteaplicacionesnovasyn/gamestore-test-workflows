import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogoutConfirmModal } from './LogoutConfirmModal';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
      navigate('/login');
    } catch {
      setLogoutError('Failed to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
    setLogoutError(null);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">GameStore</Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="hover:text-gray-300">
                Cart ({itemCount})
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-300">Admin</Link>
              )}
              <span className="text-gray-400">Hi, {user.name}</span>
              <button onClick={() => setShowLogoutModal(true)} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={isLoggingOut}
        error={logoutError}
      />
    </nav>
  );
};