import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';

/**
 * Route guard component that checks authentication and role-based access.
 * @param {{ children?: React.ReactNode, adminOnly?: boolean }} props
 * @returns {JSX.Element} The protected content, or a redirect.
 */
function ProtectedRoute({ children, adminOnly }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      return <Navigate to="/blogs" replace />;
    }
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  adminOnly: PropTypes.bool,
};

ProtectedRoute.defaultProps = {
  children: null,
  adminOnly: false,
};

export default ProtectedRoute;