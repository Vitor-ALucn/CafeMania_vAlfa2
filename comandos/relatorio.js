// comandos/relatorio.js
const readlineSync = require('readline-sync');
const db = require('../db');
const caixaUtil = require('../utils/caixa');

exports.menu = async (usuario) => {
  console.log('\n--- RELATÓRIOS ---');
  console.log('1. 📋 Abrir Caixa');
  console.log('2. 📉 Fechar Caixa e Gerar Relatório');
  console.log('3. 📈 Vendas do Dia');
  console.log('4. ⚠️ Alertas (Estoque e Validade)');
  console.log('0. Voltar');

  const op = readlineSync.question('\n> ');
  if (op === '1') await this.abrirCaixa(usuario.id);
  else if (op === '2') await this.fecharCaixa(usuario.id);
  else if (op === '3') await this.vendasDia();
  else if (op === '4') await this.alertas();
};

exports.abrirCaixa = async (usuarioId) => {
  const caixaAberto = await caixaUtil.getAberto(usuarioId);
  if (caixaAberto) {
    console.log('⚠️ Já existe um caixa aberto.');
    return;
  }
  const valor = parseFloat(readlineSync.question('Valor de fundo de troco (R$): '));
  if (isNaN(valor) || valor <= 0) {
    console.log('Valor inválido.');
    return;
  }
  await caixaUtil.abrir(usuarioId, valor);
  console.log('✅ Caixa aberto com sucesso!');
};