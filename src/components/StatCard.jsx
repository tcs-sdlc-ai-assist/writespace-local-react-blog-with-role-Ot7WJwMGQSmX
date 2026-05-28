import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable stat card component for admin dashboard.
 * Displays a title, value, and icon with configurable background color.
 * @param {{ title: string, value: string | number, icon: string, bgColor?: string }} props
 * @returns {JSX.Element}
 */
function StatCard({ title, value, icon, bgColor }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-md sm:p-6">
      <div
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-xl ${bgColor}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
};

StatCard.defaultProps = {
  bgColor: 'bg-indigo-100 text-indigo-600',
};

export default StatCard;