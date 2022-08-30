const Cliente = require("../models/ClienteModel");

exports.index = (req, res) => {
  res.render("clientes/cliente", {
    cliente: {},
  });
};

exports.register = async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.register();

    if (cliente.errors.length > 0) {
      req.flash("errors", cliente.errors);
      req.session.save(() => res.redirect("clientes/cliente"));
      return;
    }

    req.flash("success", cliente.success);
    req.session.save(() => res.redirect("clientes/cliente/home"));
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const cliente = await Cliente.buscarPorId(req.params.id);

  if (!cliente) return res.render("404");

  res.render("clientes/editarCliente", { cliente: cliente });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const cliente = new Cliente(req.body);
    await cliente.edit(req.params.id);

    if (cliente.errors.length > 0) {
      req.flash("errors", cliente.errors);
      req.session.save(() => res.redirect(`clientes/cliente/${req.params.id}`));
      return;
    }

    req.flash("success", "Cliente Editado com sucesso");
    req.session.save(() => res.redirect("clientes/cliente/home"));
    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};
exports.buscaCEP = async (req, res) => {
  try {
    const axios = require('axios').default;
    const data = await axios.get(`https://viacep.com.br/ws/${req.body.cep}/json/`)
      .then(res => {
        console.log(res.data);
        return res.data;
      })
    return res.send(data);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: e.toString() });
  }
};
