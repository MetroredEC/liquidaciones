import React from 'react';

/**
 * KPIWidget displays a single KPI metric with label and value. It
 * uses a card style consistent with the app's theme and can be
 * reused across dashboard and other pages.
 */
const KPIWidget = ({ label, value, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue text-white',
    cyan: 'bg-cyan text-white',
    gray: 'bg-gray text-white',
  };
  return (
    <div className={`p-4 rounded shadow ${colorMap[color]}`}> 
      <div className="text-sm uppercase tracking-wide">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
};

export default KPIWidget;