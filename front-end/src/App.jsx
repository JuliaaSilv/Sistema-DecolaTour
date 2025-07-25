import React from "react";
import Layout from "./layouts/Layout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Packages from "./pages/Packages.jsx";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import PackageDetails from "./pages/PackageDetails.jsx";
import RecuperarSenha from "./pages/RecuperarSenha";
import ConfirmacaoEmail from "./pages/ConfirmacaoEmail.jsx"
import AdminPainel from "./pages/AdminPainel";
import Pagamento from "./pages/Pagamento.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import RecuperarSenhaNovaSenha from "./pages/RecuperarSenhaNovaSenha.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas sem header/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/confirmar-email" element={<ConfirmacaoEmail />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-painel" element={<AdminPainel />} />
        <Route path="/redefinir-senha" element={<RecuperarSenhaNovaSenha />} />
        
        {/* Páginas com header/footer */}
        <Route
          path="*"
          element={
            <Layout>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/" element={<Home />} />
                <Route path="/packages" element={<Packages />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/admin" element={<AdminPainel />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
