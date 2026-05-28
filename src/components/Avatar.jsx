import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns a JSX avatar element based on the user's role.
 * @param {'admin' | 'user'} role - The role of the user.
 * @returns {JSX.Element} A styled avatar element with role-distinct visuals.
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 text-white text-sm"
        aria-label="Admin avatar"
      >
        👑
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm"
      aria-label="User avatar"
    >
      📖
    </span>
  );
}

/**
 * Avatar component that renders a role-distinct visual.
 * @param {{ role: 'admin' | 'user' }} props
 * @returns {JSX.Element}
 */
function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export default Avatar;