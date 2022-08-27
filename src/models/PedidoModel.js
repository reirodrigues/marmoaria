const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  vencimentoOriginal: { type: String, required: true },
  dataPagamento: { type: String, required: false, default: "" },
  classificacao: { type: String, required: true },
  valor: { type: String, required: true },
  tipoConta: { type: String, required: true },
  cliente: { type: String, required: true },
  origem: { type: String, required: true },
  status: { type: String, required: true },
  criadoEm: { type: Date, default: Date.now },
});

const PedidoModel = mongoose.model("Pedido", PedidoSchema);

function Pedido(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.pedido = null;
}

Pedido.prototype.register = async function () {
  this.valida();

  if (this.errors.length > 0) return;
  this.success.push("Pedido cadastrado com sucesso");
  this.pedido = await PedidoModel.create(this.body);
};

Pedido.prototype.valida = function () {
  this.cleanUp();

  if (!this.body.vencimentoOriginal)
    this.errors.push("Vencimento Original é um campo obrigatório");
  if (!this.body.classificacao) this.errors.push("Classificação é obrigatório");
  if (!this.body.valor) this.errors.push("Valor é um campo obrigatório");
  if (!this.body.tipoConta) this.errors.push("Tipo de conta é obrigatório");
  if (!this.body.cliente) this.errors.push("Cliente é obrigatório");
  if (!this.body.origem) this.errors.push("Origem é obrigatório");
  if (!this.body.status) this.errors.push("Status é obrigatório");

  // const classificacao = this.body.classificacao;

  // if (classificacao.toUpperCase() == "ENTRADA") {
  //   this.body.classificacao = true;
  // } else {
  //   this.body.classificacao = false;
  // }
};

Pedido.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    vencimentoOriginal: this.body.vencimentoOriginal,
    dataPagamento: this.body.dataPagamento,
    classificacao: this.body.classificacao,
    valor: this.body.valor,
    tipoConta: this.body.tipoConta,
    cliente: this.body.cliente,
    origem: this.body.origem,
    status: this.body.status,
  };
};

Pedido.prototype.edit = async function (id) {
  if (typeof id !== "string") return;
  this.valida();
  if (this.errors.length > 0) return;
  this.pedido = await PedidoModel.findByIdAndUpdate(id, this.body, {
    new: true,
  });
};

// Métodos estáticos
Pedido.buscarPorId = async function (id) {
  if (typeof id !== "string") return;
  const pedido = await PedidoModel.findById(id);
  return pedido;
};

Pedido.buscarPedidos = async function () {
  const pedidos = await PedidoModel.find().sort({ criadoEm: -1 });
  return pedidos;
};

module.exports = Pedido;
