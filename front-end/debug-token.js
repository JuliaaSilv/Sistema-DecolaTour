// Script de debug para verificar o token
console.log('=== DEBUG TOKEN ===');

const token = localStorage.getItem('token');
console.log('Token existe:', !!token);

if (token) {
  console.log('Token (primeiros 100 chars):', token.substring(0, 100));
  
  try {
    // Decodificar o token manualmente
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      console.log('Payload do token:', payload);
      console.log('Expiração:', new Date(payload.exp * 1000));
      console.log('Agora:', new Date());
      console.log('Token válido:', payload.exp > Date.now() / 1000);
    }
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
  }
}

console.log('===================');
