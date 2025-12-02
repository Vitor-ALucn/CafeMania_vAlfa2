// comandos/auth.js
const readlineSync = require('readline-sync');
const db = require('../db');
const bcrypt = require('bcryptjs');

// Função de login
exports.login = async () => {
  console.log('\n--- LOGIN ---');
  const email = readlineSync.question('E-mail: ').trim();
  const senha = readlineSync.question('Senha: ', { hideEchoBack: true });

  if (!email || !senha) {
    console.log('⚠️ E-mail e senha são obrigatórios.');
    return null;
  }

  try {
    const [usuarios] = await db.execute('SELECT id, nome, perfil, senha FROM usuarios WHERE email = ?', [email]);
    
    if (usuarios.length === 0) {
      console.log('❌ E-mail ou senha inválidos.');
      return null;
    }

    const user = usuarios[0];
    const valido = await bcrypt.compare(senha, user.senha);

    if (!valido) {
      console.log('❌ E-mail ou senha inválidos.');
      return null;
    }

    console.log(`✅ Login bem-sucedido! Bem-vindo, ${user.nome}.`);
    return {
      id: user.id,
      nome: user.nome,
      perfil: user.perfil
    };
  } catch (err) {
    console.error('Erro no login:', err.message);
    return null;
  }
};

// Função de cadastro
exports.cadastrar = async () => {
  console.log('\n--- CADASTRO DE USUÁRIO ---');
  const nome = readlineSync.question('Nome: ').trim();
  const email = readlineSync.question('E-mail: ').trim();
  const senha = readlineSync.question('Senha: ', { hideEchoBack: true });
  const perfilOp = readlineSync.question('Perfil (1=Admin, 2=Gerente, 3=Atendente): ').trim();

  const perfilMap = { '1': 'administrador', '2': 'gerente', '3': 'atendente' };
  const perfil = perfilMap[perfilOp] || 'atendente';

  if (!nome || !email || !senha) {
    console.log('⚠️ Todos os campos são obrigatórios.');
    return;
  }

  try {
    const hashed = await bcrypt.hash(senha, 10);
    await db.execute(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome, email, hashed, perfil]
    );
    console.log('✅ Usuário cadastrado com sucesso!');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('⚠️ E-mail já cadastrado.');
    } else {
      console.error('❌ Erro ao cadastrar:', err.message);
    }
  }
};