/**
 * API SIMPLES - DecolaTour
 * Apenas funções básicas para login e cadastro
 */
import { jwtDecode } from 'jwt-decode';


// URL do seu backend
const API_URL = 'http://localhost:5295/api';

/**
 * Função para fazer login
 */
export async function fazerLogin(email, senha) {
  try {
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        senha: senha,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Salvar token no navegador
      localStorage.setItem('token', data.token);
      return { sucesso: true, dados: data };
    } else {
      const erro = await response.text();
      return { sucesso: false, erro: erro };
    }
  } catch (error) {
    return { sucesso: false, erro: 'Erro de conexão' };
  }
}

/**
 * Função para fazer cadastro
 */
export async function fazerCadastro(nome, email, senha, cpf, telefone, dataNascimento) {
  try {
    const response = await fetch(`${API_URL}/Auth/registrar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
        cpf: cpf,
        telefone: telefone,
        dataNascimento: dataNascimento,
        tipoUsuarioId: 3, // Cliente padrão
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Salvar token no navegador
      localStorage.setItem('token', data.token);
      return { sucesso: true, dados: data };
    } else {
      let erro = 'Erro desconhecido';
      
      try {
        const errorData = await response.text();
        
        // Tratamento específico para diferentes códigos de erro
        switch (response.status) {
          case 409:
            erro = 'Este email ou CPF já está cadastrado no sistema';
            break;
          case 400:
            erro = 'Dados inválidos. Verifique as informações fornecidas';
            break;
          default:
            erro = errorData || `Erro ${response.status}: ${response.statusText}`;
        }
      } catch (parseError) {
        erro = `Erro ${response.status}: ${response.statusText}`;
      }
      
      return { sucesso: false, erro: erro };
    }
  } catch (error) {
    return { sucesso: false, erro: 'Erro de conexão' };
  }
}

/**
 * Função para fazer logout
 */
export function fazerLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('redirectAfterLogin'); // Limpa redirecionamentos pendentes
}

/**
 * Função para verificar se está logado
 */
export function estaLogado() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    
    // Se o token expirou, remove automaticamente e retorna false
    if (decoded.exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('redirectAfterLogin');
      return false;
    }
    
    return true;
  } catch (error) {
    // Se o token é inválido, remove automaticamente e retorna false
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
    return false;
  }
}
/**
 * Função para obter o tipo de usuário a partir do token JWT
 */
export function obterTipoUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    
    // Se o token expirou, limpa e retorna null
    if (decoded.exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('redirectAfterLogin');
      return null;
    }
    
    return decoded.role; // "role" vem do ClaimTypes.Role
  } catch (error) {
    // Se o token é inválido, limpa e retorna null
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
    return null;
  }
}

/**
 * Função para obter o ID do usuário a partir do token JWT
 */
export function obterIdUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    
    // Se o token expirou, limpa e retorna null
    if (decoded.exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('redirectAfterLogin');
      return null;
    }
    
    return decoded.nameid || decoded.sub || decoded.userId; // Diferentes possibilidades de ID no token
  } catch (error) {
    // Se o token é inválido, limpa e retorna null
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
    return null;
  }
}

/**
 * Função para obter dados completos do usuário a partir do token JWT
 */
export function obterDadosUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    
    // Se o token expirou, limpa e retorna null
    if (decoded.exp < now) {
      localStorage.removeItem('token');
      localStorage.removeItem('redirectAfterLogin');
      return null;
    }
    
    return {
      id: decoded.nameid || decoded.sub || decoded.userId,
      email: decoded.email,
      nome: decoded.name || decoded.unique_name,
      role: decoded.role,
    };
  } catch (error) {
    // Se o token é inválido, limpa e retorna null
    localStorage.removeItem('token');
    localStorage.removeItem('redirectAfterLogin');
    return null;
  }
}

export function temPermissao(rolesPermitidas) {
  const role = obterTipoUsuario();
  return role && rolesPermitidas.includes(role.toString());
}

/**
 * Função para limpar completamente a sessão
 */
export function limparSessao() {
  localStorage.removeItem('token');
  localStorage.removeItem('redirectAfterLogin');
  // Adicione aqui outros itens do localStorage relacionados à sessão se houver
}

/**
 * Função para forçar logout em caso de erro de autenticação
 */
export function forcarLogout() {
  limparSessao();
  // Redireciona para home
  window.location.href = '/home';
}