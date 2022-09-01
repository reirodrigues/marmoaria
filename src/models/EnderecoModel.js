const mongoose = require("mongoose");

const EnderecoSchema = new mongoose.Schema({
  cep: { type: String },
  rua: { type: String },
  numero: { type: Number },
  bairro: { type: String },
  cidade: { type: String },
  estado: { type: String },
  complemento: { type: String },
  clienteId: { type: mongoose.Schema.Types.ObjectId },
  criadoEm: { type: Date, default: Date.now },
});

const EnderecoModel = mongoose.model("Endereco", EnderecoSchema);

function Endereco(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.endereco = null;
}

Endereco.prototype.register = async function () {
  this.valida();
  if (this.errors.length > 0) return;

  this.success.push("Endereco cadastrado com sucesso");
  this.endereco = await EnderecoModel.create(this.body);
};

Endereco.prototype.valida = function () {
  //this.cleanUp();

  if (!this.body.cep) this.errors.push("Cep é um campo obrigatório");
  if (!this.body.rua) this.errors.push("Rua é um campo obrigatório");
  if (!this.body.numero) this.errors.push("Numero é um campo obrigatório");
  if (!this.body.cidade) this.errors.push("Cidade é um campo obrigatório");
  if (!this.body.Estado) this.errors.push("Estado é um campo obrigatório");
};

Endereco.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
};

Endereco.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.endereco = await EnderecoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

//Métodos estáticos

Endereco.buscarPorId = async function (id) {
  if (typeof id !== "string") return;
  const Endereco = await EnderecoModel.findById(id);
  return Endereco;
};

Endereco.buscarEnderecos = async function () {
  const Endereco = await EnderecoModel.find().sort({
    criadoEm: -1,
  });
  return Endereco;
};
Endereco.buscarEnderecosPF = async function () {
  const EnderecoPF = await EnderecoModel.find({ cpf: { $gt: 1 } }).sort({
    criadoEm: -1,
  });
  return EnderecoPF;
};
Endereco.buscarEnderecosPJ = async function () {
  const EnderecoPJ = await EnderecoModel.find({ cnpj: { $gt: 1 } }).sort({
    criadoEm: -1,
  });
  return EnderecoPJ;
};

module.exports = Endereco;
