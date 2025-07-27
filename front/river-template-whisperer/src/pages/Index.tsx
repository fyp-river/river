
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-river">
      <Header />
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
