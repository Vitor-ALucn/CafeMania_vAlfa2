// comandos/estoque.js
const readlineSync = require('readline-sync');
const db = require('../db');

exports.movimentar = async () => {
  console.log('\n--- MOVIMENTAÇÃO DE ESTOQUE ---');
  console.log('1. 📥 Entrada');
  console.log('2. 📤 Saída (ajuste)');
  console.log('0. Voltar');

  const tipoOp = readlineSync.question('\n> ');
  if (tipoOp === '0') return;

  const [produtos] = await db.execute('SELECT id, nome, quantidade_estoque FROM produtos');
  console.log('\nProdutos:');
  produtos.forEach(p => console.log(`${p.id}. ${p.nome} [${p.quantidade_estoque}]`));

  const idStr = readlineSync.question('\nID do produto: ').trim();
  const id = parseInt(idStr);
  if (!produtos.some(p => p.id === id)) {
    console.log('Produto inválido.');
    return;
  }

  const qtdStr = readlineSync.question('Quantidade: ').trim();
  const qtd = parseInt(qtdStr);
  if (isNaN(qtd) || qtd <= 0) {
    console.log('Quantidade inválida.');
    return;
  }

  if (tipoOp === '1') {
    // Entrada
    await db.execute('UPDATE produtos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?', [qtd, id]);
    await db.execute('INSERT INTO movimentacao_estoque (produto_id, tipo, quantidade) VALUES (?, "entrada", ?)', [id, qtd]);
    console.log('✅ Entrada registrada.');
  } else if (tipoOp === '2') {
    // Saída (ajuste)
    const [atual] = await db.execute('SELECT quantidade_estoque FROM produtos WHERE id = ?', [id]);
    if (atual[0].quantidade_estoque < qtd) {
      console.log('⚠️ Estoque insuficiente para saída.');
      return;
    }
    await db.execute('UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?', [qtd, id]);
    await db.execute('INSERT INTO movimentacao_estoque (produto_id, tipo, quantidade) VALUES (?, "saida", ?)', [id, qtd]);
    console.log('✅ Saída registrada.');
  }
};