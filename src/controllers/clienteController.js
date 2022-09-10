const Cliente = require("../models/ClienteModel");
const Endereco = require("../models/EnderecoModel");

exports.index = (req, res) => {
  res.render("clientes/cliente", {
    cliente: {},
  });
};

exports.register = async (req, response) => {
  try {
    const cliente = new Cliente(req.body);

    await cliente.registerCliente();
    if (cliente.errors.length == 0) {
      await cliente.registerAdresses();
    }

    if (cliente.errors.length > 0) {
      req.flash("errors", cliente.errors);
      return response.status(400).send({ messages: cliente.errors });
    }

    req.flash("success", cliente.success);
    return response.status(201).send({ route: "/cliente/home" });
    // return;
  } catch (e) {
    console.log(e);
    return response.render("404");
  }
};

exports.editIndex = async (req, res) => {
  if (!req.params.id) return res.render("404");

  const cliente = await Cliente.buscarPorId(req.params.id);
  // console.log(cliente);

  if (!cliente) return res.render("404");

  res.render("clientes/editarCliente", {
    cliente: cliente,
  });
};

exports.edit = async (req, res) => {
  try {
    //console.log(req.params.id);
    // return res.status(400).send({ message: "error" });
    // if (!req.params.id) return res.render("404");

    const cliente = new Cliente(req.body);

    await cliente.edit(req.params.id);
    await cliente.registerAdresses();

    if (cliente.errors.length > 0) {
      return res.status(400).send({ message: cliente.errors });
    }

    req.flash("success", "Usuario atualizado com sucesso!");
    return res.send({ route: "/cliente/home" });

    // req.flash("success", "Cliente Editado com sucesso");
    // req.session.save(() => res.redirect("/cliente/home"));
    // return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.buscaCEP = async (req, res) => {
  try {
    const axios = require("axios").default;

    const data = await axios
      .get(`https://viacep.com.br/ws/${req.body.cep}/json/`)
      .then((res) => {
        return res.data;
      });

    if (data.logradouro == undefined) {
      return res.status(400).send({ message: "Verifique o CEP!" });
    }

    return res.send(data);
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: e.toString() });
  }
};
