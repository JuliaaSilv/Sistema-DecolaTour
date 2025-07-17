import React from 'react';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}