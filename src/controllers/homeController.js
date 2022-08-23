const Pedido = require("../models/PedidoModel");
const Cliente = require("../models/ClienteModel");
const Conta = require("../models/ContaModel");
const Origem = require("../models/OrigemModel");

exports.index = async (req, res) => {
  const pedidos = await Pedido.buscarPedidos();
  res.render("index", { pedidos });
};

exports.clienteIndex = async (req, res) => {
  const clientes = await Cliente.buscarClientes();
  res.render("clienteIndex", { clientes });
};

exports.contaIndex = async (req, res) => {
  const contas = await Conta.buscarContas();
  res.render("contaIndex", { contas });
};
exports.origemIndex = async (req, res) => {
  const origens = await Origem.buscarOrigens();
  res.render("origemIndex", { origens });
};
