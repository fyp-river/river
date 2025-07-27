
import React from 'react';
import SensorDashboard from '@/components/sensors/SensorDashboard';

const SensorDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <SensorDashboard />
      </div>
    </div>
  );
};

export default SensorDashboardPage;
