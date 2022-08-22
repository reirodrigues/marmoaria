const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema({
  dataPagamento: { type: String, required: true },
  classificacao: { type: String, required: true },
  valor: { type: String, required: true },
  tipoConta: { type: String, required: true },
  cliente: { type: String, required: true },
  origem: { type: String, required: true },
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

  if (!this.body.dataPagamento)
    this.errors.push("Data de pagamento é obrigatório");
  if (!this.body.classificacao) this.errors.push("Classificação é obrigatório");
  if (!this.body.valor) this.errors.push("Valor é um campo obrigatório");
  if (!this.body.tipoConta) this.errors.push("Tipo de conta é obrigatório");
  if (!this.body.cliente) this.errors.push("Cliente é obrigatório");
  if (!this.body.origem) this.errors.push("Origem é obrigatório");
};

Pedido.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }

  this.body = {
    dataPagamento: this.body.dataPagamento,
    classificacao: this.body.classificacao,
    valor: this.body.valor,
    tipoConta: this.body.tipoConta,
    cliente: this.body.cliente,
    origem: this.body.origem,
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
