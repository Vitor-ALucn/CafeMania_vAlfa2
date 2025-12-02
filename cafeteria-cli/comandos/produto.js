// comandos/produto.js
const readlineSync = require('readline-sync');
const db = require('../db');

exports.cadastrar = async () => {
  console.log('\n--- CADASTRO DE PRODUTO ---');
  const nome = readlineSync.question('Nome: ');
  const precoCusto = parseFloat(readlineSync.question('Preço de custo (R$): '));
  const precoVenda = parseFloat(readlineSync.question('Preço de venda (R$): '));
  
  if (precoVenda <= precoCusto) {
    console.log('⚠️ Preço de venda deve ser maior que o custo.');
    return;
  }

  const [categorias] = await db.execute('SELECT id, nome FROM categorias');
  console.log('\nCategorias:');
  categorias.forEach(c => console.log(`${c.id}. ${c.nome}`));
  const catId = parseInt(readlineSync.question('ID da categoria: '));

  const [fornecedores] = await db.execute('SELECT id, nome FROM fornecedores');
  console.log('\nFornecedores:');
  fornecedores.forEach(f => console.log(`${f.id}. ${f.nome}`));
  const fornId = parseInt(readlineSync.question('ID do fornecedor (0 se não aplicável): ')) || null;

  const validade = readlineSync.question('Validade (AAAA-MM-DD, opcional): ') || null;
  const qtd = parseInt(readlineSync.question('Estoque inicial: ')) || 0;
  const qtdMin = parseInt(readlineSync.question('Quantidade mínima: ')) || 5;

  await db.execute(
    `INSERT INTO produtos 
     (nome, categoria_id, preco_custo, preco_venda, validade, fornecedor_id, quantidade_estoque, quantidade_minima)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, catId, precoCusto, precoVenda, validade, fornId, qtd, qtdMin]
  );
  console.log('✅ Produto cadastrado!');
};