const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cnpj: { type: String, required: true },
  telefone: { type: String, required: true },
  endereco: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const ClienteModel = mongoose.model("Cliente", ClienteSchema);

function Cliente(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.cliente = null;
}

Cliente.prototype.register = async function () {
  this.valida();

  if (this.errors.length > 0) return;
  this.success.push("Cliente cadastrado com sucesso");
  this.cliente = await ClienteModel.create(this.body);
};

Cliente.prototype.valida = function () {
  this.cleanUp();

  if (!this.body.nome) this.errors.push("Nome é um campo obrigatório");
  if (!this.body.cnpj) this.errors.push("CNPJ é um campo obrigatório");
  if (!this.body.telefone) this.errors.push("Telefone é um campo obrigatório");
  if (!this.body.endereco) this.errors.push("Endereço é um campo obrigatório");
};

Cliente.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    nome: this.body.nome,
    cnpj: this.body.cnpj,
    telefone: this.body.telefone,
    endereco: this.body.endereco,
  };
};

Cliente.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.cliente = await ClienteModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

//Métodos estáticos

Cliente.buscarPorId = async function (id) {
  if (typeof id !== "string") return;
  const cliente = await ClienteModel.findById(id);
  return cliente;
};

Cliente.buscarClientes = async function () {
  const cliente = await ClienteModel.find().sort({ criadoEm: -1 });
  return cliente;
};

module.exports = Cliente;
