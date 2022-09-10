const mongoose = require("mongoose");

const ContaSchema = new mongoose.Schema({
  tipoConta: { type: String, required: true },
  entrada: { type: Boolean },
  saida: { type: Boolean },
  pedidoId: { type: mongoose.Schema.Types.ObjectId, ref: "Pedido" },
  criadoEm: { type: Date, default: Date.now },
});

const ContaModel = mongoose.model("Conta", ContaSchema);

function Conta(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.pedido = null;
}

Conta.prototype.register = async function () {
  this.valida();

  if (this.errors.length > 0) return;
  this.success.push("Conta cadastrada com sucesso");
  this.conta = await ContaModel.create(this.body);
};

Conta.prototype.valida = function () {
  this.cleanUp();

  if (this.body.entrada == "true") {
    this.body.entrada = true;
  }

  if (this.body.saida == "true") {
    this.body.saida = true;
  }

  if (!this.body.tipoConta) this.errors.push("Conta é um campo obrigatório");
};

Conta.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    tipoConta: this.body.tipoConta,
    entrada: this.body.entrada,
    saida: this.body.saida,
  };
};

Conta.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.conta = await ContaModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estáticos
Conta.buscarPorId = async function (id) {
  if (typeof id !== "string") return;
  const conta = await ContaModel.findById(id);
  return conta;
};

Conta.buscarContas = async function () {
  const contas = await ContaModel.find().sort({ criadoEm: -1 });
  return contas;
};

module.exports = Conta;
