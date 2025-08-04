import React from "react";
import Layout from "./layouts/Layout.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Packages from "./pages/Packages.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import PackageDetails from "./pages/PackageDetails.jsx";
import RecuperarSenha from "./pages/RecuperarSenha";
import ConfirmacaoEmail from "./pages/ConfirmacaoEmail.jsx"
import AdminPainel from "./pages/AdminPainel";
import Pagamento from "./pages/Pagamento.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import RecuperarSenhaNovaSenha from "./pages/RecuperarSenhaNovaSenha.jsx";
import Perfil from "./pages/Perfil.jsx";
import MinhasReservas from "./pages/MinhasReservas.jsx";
import ReservaDetalhes from "./pages/ReservaDetalhes.jsx";



import ChatbotPopup from "./components/chatbot/ChatbotPopup.jsx";
import AccessibilityButton from "./components/accessibility/AccessibilityButton.jsx";


function App() {
  return (
    <BrowserRouter>
      <ChatbotPopup />
      {/* AccessibilityButton: left side, vertically centered, always visible */}
      <AccessibilityButton />
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
                <Route path="/search-results" element={<SearchResults />} />
                <Route path="/packages/:id" element={<PackageDetails />} />
                <Route path="/booking-form/:id" element={<BookingForm />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                <Route path="/admin" element={<AdminPainel />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/minhas-reservas" element={<MinhasReservas />} />
                <Route path="/reserva-detalhes/:id" element={<ReservaDetalhes />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
