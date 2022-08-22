const Cliente = require("../models/ClienteModel");

exports.index = (req, res) => {
  res.render("cliente", {
    cliente: {},
  });
};

exports.register = async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.register();

    if (cliente.errors.length > 0) {
      req.flash("errors", cliente.errors);
      req.session.save(() => res.redirect("/cliente"));
      return;
    }

    req.flash("success", cliente.success);
    req.session.save(() => res.redirect("/cliente/home"));
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

  res.render("editarCliente", { cliente: cliente });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const cliente = new Cliente(req.body);
    await cliente.edit(req.params.id);

    if (cliente.errors.length > 0) {
      req.flash("errors", cliente.errors);
      req.session.save(() => res.redirect(`/cliente/${req.params.id}`));
      return;
    }

    req.flash("success", "Cliente Editado com sucesso");
    req.session.save(() => res.redirect("/cliente/home"));
    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};
