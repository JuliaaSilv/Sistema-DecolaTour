import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}