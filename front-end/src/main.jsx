import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'
import { AccessibilityProvider } from './components/accessibility/AccessibilityContext.jsx';
import Header from './components/layout/Header.jsx'
import { jwtDecode } from 'jwt-decode'

// Verificar e limpar tokens inválidos no início da aplicação
function verificarELimparTokensInvalidos() {
  const token = localStorage.getItem('token');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      
      // Se o token expirou, remove ele
      if (decoded.exp < now) {
        console.log('Token expirado detectado, removendo...');
        localStorage.removeItem('token');
      }
    } catch (error) {
      // Se o token é inválido ou malformado, remove ele
      console.log('Token inválido detectado, removendo...');
      localStorage.removeItem('token');
    }
  }
}

// Executar verificação antes de inicializar a aplicação
verificarELimparTokensInvalidos();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </StrictMode>,
)
