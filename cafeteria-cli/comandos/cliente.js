// comandos/cliente.js
const readlineSync = require('readline-sync');
const db = require('../db');

exports.listar = async () => {
  const [clientes] = await db.execute('SELECT id, nome, cpf FROM clientes ORDER BY id');
  console.log('\n--- CLIENTES CADASTRADOS ---');
  if (clientes.length === 0) {
    console.log('Nenhum cliente cadastrado.');
    return;
  }
  clientes.forEach(c => console.log(`Código: ${c.id} | Nome: ${c.nome} | CPF: ${c.cpf}`));
};

exports.cadastrar = async () => {
  console.log('\n--- CADASTRO DE CLIENTE ---');
  const nome = readlineSync.question('Nome: ').trim();
  const cpf = readlineSync.question('CPF: ').trim();

  if (!nome || !cpf) {
    console.log('⚠️ Nome e CPF são obrigatórios.');
    return;
  }

  try {
    const [result] = await db.execute('INSERT INTO clientes (nome, cpf) VALUES (?, ?)', [nome, cpf]);
    console.log(`✅ Cliente cadastrado! Código: ${result.insertId}`);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('⚠️ CPF já cadastrado.');
    } else {
      console.log('❌ Erro:', err.message);
    }
  }
};

exports.excluir = async () => {
  await exports.listar();
  const idStr = readlineSync.question('\nDigite o código do cliente para excluir (0 para cancelar): ').trim();
  const id = parseInt(idStr);
  if (id === 0 || isNaN(id)) return;

  const [existe] = await db.execute('SELECT nome FROM clientes WHERE id = ?', [id]);
  if (existe.length === 0) {
    console.log('Cliente não encontrado.');
    return;
  }

  if (readlineSync.keyInYN(`Excluir cliente "${existe[0].nome}"?`)) {
    await db.execute('DELETE FROM clientes WHERE id = ?', [id]);
    console.log('✅ Cliente excluído.');
  }
};