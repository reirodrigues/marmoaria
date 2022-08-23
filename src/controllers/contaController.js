const Conta = require("../models/ContaModel");
const Cliente = require("../models/ClienteModel");

exports.index = async (req, res) => {
  const contas = await Conta.buscarContas();

  res.render("conta", {
    conta: {},
    contas: contas,
  });
};

exports.register = async (req, res) => {
  try {
    const conta = new Conta(req.body);
    await conta.register();

    if (conta.errors.length > 0) {
      req.flash("errors", conta.errors);
      req.session.save(() => res.redirect("/conta"));
      return;
    }

    req.flash("success", conta.success);
    req.session.save(() => res.redirect("/conta/home"));
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const conta = await Conta.buscarPorId(req.params.id);

  if (!conta) return res.render("404");

  res.render("editarConta", { conta: conta });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const conta = new Conta(req.body);
    await conta.edit(req.params.id);

    if (conta.errors.length > 0) {
      req.flash("errors", conta.errors);
      req.session.save(() => res.redirect(`/conta/${req.params.id}`));
      return;
    }

    req.flash("success", "Conta Editado com sucesso");
    req.session.save(() => res.redirect("/conta/home"));
    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};
