import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (role && !Array.isArray(role)) {
    role = [role];
  }

  if (role && !role.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};
