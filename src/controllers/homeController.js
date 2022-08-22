const Pedido = require("../models/PedidoModel");
const Cliente = require("../models/ClienteModel");

exports.index = async (req, res) => {
  const pedidos = await Pedido.buscarPedidos();
  res.render("index", { pedidos });
};

exports.clienteIndex = async (req, res) => {
  const clientes = await Cliente.buscarClientes();
  res.render("clienteIndex", { clientes });
};
