/**
 * API SIMPLES - DecolaTour
 * Apenas funções básicas para login e cadastro
 */

// URL do seu backend
const API_URL = 'http://localhost:5295/api';

/**
 * Função para fazer login
 */
export async function fazerLogin(email, senha) {
  try {
    const response = await fetch(`${API_URL}/User/login`, {
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
    const response = await fetch(`${API_URL}/User/registrar`, {
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
