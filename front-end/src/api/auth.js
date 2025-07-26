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
        tipoUsuarioId: 1, // Cliente padrão
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
 * Função para fazer logout
 */
export function fazerLogout() {
  localStorage.removeItem('token');
}

/**
 * Função para verificar se está logado
 */
export function estaLogado() {
  return localStorage.getItem('token') !== null;
}
/**
 * Função para obter o tipo de usuário a partir do token JWT
 */
export function obterTipoUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role; // "role" vem do ClaimTypes.Role
  } catch (error) {
    return null;
  }
}

export function temPermissao(rolesPermitidas) {
  const role = obterTipoUsuario();
  return role && rolesPermitidas.includes(role.toString());
}