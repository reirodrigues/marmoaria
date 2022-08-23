const mongoose = require("mongoose");

const OrigemSchema = new mongoose.Schema({
  origem: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const OrigemModel = mongoose.model("Origem", OrigemSchema);

function Origem(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.pedido = null;
}

Origem.prototype.register = async function () {
  this.valida();

  if (this.errors.length > 0) return;
  this.success.push("Origem cadastrada com sucesso");
  this.origem = await OrigemModel.create(this.body);
};

Origem.prototype.valida = function () {
  this.cleanUp();

  if (!this.body.origem) this.errors.push("Origem é um campo obrigatório");
};

Origem.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    origem: this.body.origem,
  };
};

Origem.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.origem = await OrigemModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estáticos
Origem.buscarPorId = async function (id) {
  if (typeof id !== "string") return;
  const origem = await OrigemModel.findById(id);
  return origem;
};

Origem.buscarOrigens = async function () {
  const origens = await OrigemModel.find().sort({ criadoEm: -1 });
  return origens;
};

module.exports = Origem;
