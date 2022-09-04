const Pedido = require("../models/PedidoModel");
const Cliente = require("../models/ClienteModel");
const Conta = require("../models/ContaModel");
const Origem = require("../models/OrigemModel");

exports.index = async (req, res) => {
  const clientes = await Cliente.buscarClientes();
  const contas = await Conta.buscarContas();
  const origens = await Origem.buscarOrigens();

  res.render("pedidos/pedido", {
    pedido: {},
    clientes: clientes,
    contas: contas,
    origens: origens,
  });
};

exports.register = async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.register();

    if (pedido.errors.length > 0) {
      req.flash("errors", pedido.errors);
      req.session.save(() => res.redirect("/pedido"));
      return;
    }

    req.flash("success", pedido.success);
    req.session.save(() => res.redirect("/"));
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const clientes = await Cliente.buscarClientes();
  const pedido = await Pedido.buscarPorId(req.params.id);
  const contas = await Conta.buscarContas();
  const origens = await Origem.buscarOrigens();

  if (!pedido) return res.render("404");

  res.render("pedidos/pedido_editar", {
    pedido: pedido,
    clientes: clientes,
    contas: contas,
    origens: origens,
  });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const pedido = new Pedido(req.body);
    await pedido.edit(req.params.id);

    if (pedido.errors.length > 0) {
      req.flash("errors", pedido.errors);
      req.session.save(() => res.redirect(`/pedido/${req.params.id}`));
      return;
    }

    req.flash("success", "Pedido Editado com sucesso");
    req.session.save(() => res.redirect("/"));
    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};
