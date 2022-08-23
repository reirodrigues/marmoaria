const Origem = require("../models/OrigemModel");
const Cliente = require("../models/ClienteModel");

exports.index = async (req, res) => {
  const origens = await Origem.buscarOrigens();

  res.render("origem", {
    origem: {},
    origens: origens,
  });
};

exports.register = async (req, res) => {
  try {
    const origem = new Origem(req.body);
    await origem.register();

    if (origem.errors.length > 0) {
      req.flash("errors", origem.errors);
      req.session.save(() => res.redirect("/origem"));
      return;
    }

    req.flash("success", origem.success);
    req.session.save(() => res.redirect("/origem/home"));
    return;
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const origem = await Origem.buscarPorId(req.params.id);

  if (!origem) return res.render("404");

  res.render("editarOrigem", { origem: origem });
};

exports.edit = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const origem = new Origem(req.body);
    await origem.edit(req.params.id);

    if (origem.errors.length > 0) {
      req.flash("errors", origem.errors);
      req.session.save(() => res.redirect(`/origem/${req.params.id}`));
      return;
    }

    req.flash("success", "Origem Editado com sucesso");
    req.session.save(() => res.redirect("/origem/home"));
    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};
