import React from 'react';
import Layout from './layouts/Layout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Packages from './pages/Packages';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;