const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';
let authToken = '';
let userId = '';
let adminToken = '';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function logSuccess(message) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

function logError(message) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function logInfo(message) {
  console.log(`${colors.blue}[INFO]${colors.reset} ${message}`);
}

function logTest(message) {
  console.log(`${colors.cyan}[TEST]${colors.reset} ${message}`);
}

function logSeparator() {
  console.log(`${colors.yellow}${'='.repeat(60)}${colors.reset}`);
}

async function testEndpoint(name, method, url, data = null, token = null) {
  try {
    const config = {
      method: method,
      url: `${BASE_URL}${url}`,
      headers: {}
    };

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }

    const response = await axios(config);
    logSuccess(`${name} - Status: ${response.status}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      logError(`${name} - Status: ${error.response.status} - Mensagem: ${error.response.data.message || JSON.stringify(error.response.data)}`);
    } else {
      logError(`${name} - Erro: ${error.message}`);
    }
    return null;
  }
}

async function testRegister() {
  logTest('Testando registro de usuario');
  
  const testUser = {
    name: 'Usuario Teste',
    email: `teste_${Date.now()}@email.com`,
    password: 'senha123'
  };
  
  const result = await testEndpoint('Registrar usuario', 'post', '/register', testUser);
  
  if (result && result.token) {
    authToken = result.token;
    userId = result.user?._id || result.user?.id;
    logSuccess(`Token obtido: ${authToken.substring(0, 20)}...`);
    return true;
  }
  return false;
}

async function testRegisterWithExistingEmail() {
  logTest('Testando registro com email existente');
  
  const testUser = {
    name: 'Usuario Duplicado',
    email: 'teste@email.com',
    password: 'senha123'
  };
  
  await testEndpoint('Registrar com email existente', 'post', '/register', testUser);
  await testEndpoint('Tentar registrar mesmo email', 'post', '/register', testUser);
}

async function testRegisterInvalidData() {
  logTest('Testando registro com dados invalidos');
  
  const testCases = [
    { name: 'Sem nome', data: { email: 'test@email.com', password: '123456' } },
    { name: 'Sem email', data: { name: 'Teste', password: '123456' } },
    { name: 'Sem senha', data: { name: 'Teste', email: 'test@email.com' } },
    { name: 'Email invalido', data: { name: 'Teste', email: 'emailinvalido', password: '123456' } },
    { name: 'Senha curta', data: { name: 'Teste', email: 'test@email.com', password: '123' } }
  ];
  
  for (const testCase of testCases) {
    await testEndpoint(`Registro ${testCase.name}`, 'post', '/register', testCase.data);
  }
}

async function testLogin() {
  logTest('Testando login');
  
  const loginData = {
    email: 'teste@email.com',
    password: 'senha123'
  };
  
  const result = await testEndpoint('Login com credenciais validas', 'post', '/login', loginData);
  
  if (result && result.token && !authToken) {
    authToken = result.token;
    userId = result.user?._id || result.user?.id;
    logSuccess(`Login realizado com sucesso`);
  }
  return result;
}

async function testLoginInvalidCredentials() {
  logTest('Testando login com credenciais invalidas');
  
  await testEndpoint('Login com email errado', 'post', '/login', { email: 'errado@email.com', password: 'senha123' });
  await testEndpoint('Login com senha errada', 'post', '/login', { email: 'teste@email.com', password: 'senhaerrada' });
  await testEndpoint('Login sem email', 'post', '/login', { password: 'senha123' });
  await testEndpoint('Login sem senha', 'post', '/login', { email: 'teste@email.com' });
}

async function testGetProfile() {
  logTest('Testando obter perfil');
  
  if (!authToken) {
    logError('Token nao disponivel');
    return;
  }
  
  await testEndpoint('Obter perfil com token valido', 'get', '/me', null, authToken);
  await testEndpoint('Obter perfil sem token', 'get', '/me');
  await testEndpoint('Obter perfil com token invalido', 'get', '/me', null, 'tokeninvalido123');
}

async function testUpdateProfile() {
  logTest('Testando atualizar perfil');
  
  if (!authToken) {
    logError('Token nao disponivel');
    return;
  }
  
  const updateData = {
    name: 'Usuario Atualizado',
    email: `atualizado_${Date.now()}@email.com`
  };
  
  await testEndpoint('Atualizar nome e email', 'put', '/me', updateData, authToken);
  await testEndpoint('Atualizar com dados invalidos', 'put', '/me', { campoInvalido: 'valor' }, authToken);
}

async function testUpdatePassword() {
  logTest('Testando atualizar senha');
  
  if (!authToken) {
    logError('Token nao disponivel');
    return;
  }
  
  const updateData = {
    password: 'novaSenha456'
  };
  
  await testEndpoint('Atualizar senha', 'put', '/me', updateData, authToken);
  
  const loginWithNewPassword = await testEndpoint('Login com nova senha', 'post', '/login', { 
    email: 'teste@email.com', 
    password: 'novaSenha456' 
  });
  
  if (loginWithNewPassword && loginWithNewPassword.token) {
    authToken = loginWithNewPassword.token;
    logSuccess('Senha atualizada e login com nova senha funcionou');
  }
}

async function testCreateAdminUser() {
  logTest('Criando usuario admin');
  
  const adminUser = {
    name: 'Admin Teste',
    email: `admin_${Date.now()}@email.com`,
    password: 'admin123',
    role: 'admin'
  };
  
  const result = await testEndpoint('Registrar admin', 'post', '/register', adminUser);
  
  if (result && result.token) {
    const loginResult = await testEndpoint('Login como admin', 'post', '/login', {
      email: adminUser.email,
      password: adminUser.password
    });
    
    if (loginResult && loginResult.token) {
      adminToken = loginResult.token;
      logSuccess('Admin criado e logado com sucesso');
    }
  }
}

async function testAdminGetAllUsers() {
  logTest('Testando listar todos usuarios (admin)');
  
  if (!adminToken) {
    logError('Token admin nao disponivel');
    return;
  }
  
  const result = await testEndpoint('Listar todos usuarios', 'get', '/users', null, adminToken);
  
  if (result && result.users) {
    logSuccess(`Total de usuarios encontrados: ${result.users.length}`);
    if (result.users.length > 0) {
      userId = result.users[0]._id;
      logInfo(`ID do primeiro usuario: ${userId}`);
    }
  }
}

async function testAdminGetUserById() {
  logTest('Testando buscar usuario por ID (admin)');
  
  if (!adminToken || !userId) {
    logError('Token admin ou user ID nao disponivel');
    return;
  }
  
  await testEndpoint('Buscar usuario por ID', 'get', `/users/${userId}`, null, adminToken);
  await testEndpoint('Buscar usuario com ID invalido', 'get', `/users/idinvalido123`, null, adminToken);
}

async function testAdminUpdateUser() {
  logTest('Testando atualizar usuario por ID (admin)');
  
  if (!adminToken || !userId) {
    logError('Token admin ou user ID nao disponivel');
    return;
  }
  
  const updateData = {
    name: 'Usuario Alterado pelo Admin',
    role: 'user'
  };
  
  await testEndpoint('Atualizar usuario por ID', 'put', `/users/${userId}`, updateData, adminToken);
}

async function testDeleteOwnAccount() {
  logTest('Testando deletar propria conta');
  
  const tempUser = {
    name: 'Usuario Temporario',
    email: `temp_${Date.now()}@email.com`,
    password: 'temp123'
  };
  
  const registerResult = await testEndpoint('Registrar usuario temporario', 'post', '/register', tempUser);
  
  if (registerResult && registerResult.token) {
    const tempToken = registerResult.token;
    await testEndpoint('Deletar conta temporaria', 'delete', '/me', null, tempToken);
    await testEndpoint('Tentar acessar conta deletada', 'get', '/me', null, tempToken);
  }
}

async function testProtectedRoutesWithoutToken() {
  logTest('Testando rotas protegidas sem token');
  
  await testEndpoint('GET /me sem token', 'get', '/me');
  await testEndpoint('PUT /me sem token', 'put', '/me', { name: 'Teste' });
  await testEndpoint('DELETE /me sem token', 'delete', '/me');
}

async function testRateLimit() {
  logTest('Testando limite de requisicoes');
  
  logInfo('Fazendo 105 requisicoes para testar rate limit...');
  let rateLimitHit = false;
  
  for (let i = 0; i < 105; i++) {
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: 'teste@email.com',
        password: 'senha123'
      });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        rateLimitHit = true;
        logSuccess(`Rate limit ativado apos ${i + 1} requisicoes`);
        break;
      }
    }
  }
  
  if (rateLimitHit) {
    logSuccess('Rate limit esta funcionando corretamente');
  } else {
    logError('Rate limit nao foi ativado');
  }
}

async function testSwaggerDocumentation() {
  logTest('Testando documentacao Swagger');
  
  try {
    const response = await axios.get('http://localhost:3000/api-docs');
    if (response.status === 200) {
      logSuccess('Swagger UI esta acessivel');
    }
  } catch (error) {
    logError('Swagger UI nao esta acessivel');
  }
  
  try {
    const response = await axios.get('http://localhost:3000/api-docs/swagger.json');
    if (response.status === 200) {
      logSuccess('Documentacao Swagger JSON esta disponivel');
    }
  } catch (error) {
    logError('Documentacao Swagger JSON nao encontrada');
  }
}

async function testPerformance() {
  logTest('Testando performance da API');
  
  const startTime = Date.now();
  const requests = [];
  
  for (let i = 0; i < 10; i++) {
    requests.push(
      axios.get(`${BASE_URL}/me`).catch(() => null)
    );
  }
  
  await Promise.all(requests);
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  logSuccess(`10 requisicoes completadas em ${duration}ms`);
  logInfo(`Media de ${duration / 10}ms por requisicao`);
}

async function runAllTests() {
  logSeparator();
  console.log(`${colors.cyan}INICIANDO TESTES COMPLETOS DA API${colors.reset}`);
  logSeparator();
  
  await testSwaggerDocumentation();
  logSeparator();
  
  await testRegister();
  await testRegisterWithExistingEmail();
  await testRegisterInvalidData();
  logSeparator();
  
  await testLogin();
  await testLoginInvalidCredentials();
  logSeparator();
  
  await testGetProfile();
  await testUpdateProfile();
  await testUpdatePassword();
  logSeparator();
  
  await testCreateAdminUser();
  await testAdminGetAllUsers();
  await testAdminGetUserById();
  await testAdminUpdateUser();
  logSeparator();
  
  await testDeleteOwnAccount();
  logSeparator();
  
  await testProtectedRoutesWithoutToken();
  logSeparator();
  
  await testRateLimit();
  logSeparator();
  
  await testPerformance();
  logSeparator();
  
  console.log(`${colors.green}TESTES CONCLUIDOS${colors.reset}`);
  logSeparator();
  
  console.log(`\n${colors.cyan}RESUMO:${colors.reset}`);
  console.log(`Token de autenticacao: ${authToken ? 'Obtido com sucesso' : 'Falha na obtencao'}`);
  console.log(`Token de admin: ${adminToken ? 'Obtido com sucesso' : 'Falha na obtencao'}`);
  console.log(`URL da API: ${BASE_URL}`);
  console.log(`Documentacao Swagger: http://localhost:3000/api-docs`);
}

async function runQuickTest() {
  logSeparator();
  console.log(`${colors.cyan}TESTE RAPIDO DA API${colors.reset}`);
  logSeparator();
  
  await testRegister();
  await testLogin();
  await testGetProfile();
  
  if (authToken) {
    logSuccess(`\nAPI esta funcionando corretamente!`);
    logInfo(`Token: ${authToken.substring(0, 30)}...`);
    logInfo(`User ID: ${userId}`);
  } else {
    logError(`\nAPI nao esta respondendo corretamente.`);
    logInfo(`Verifique se o servidor esta rodando na porta 3000`);
  }
  
  logSeparator();
}

const testType = process.argv[2];

if (testType === 'quick') {
  runQuickTest();
} else if (testType === 'performance') {
  testPerformance();
} else {
  runAllTests();
}