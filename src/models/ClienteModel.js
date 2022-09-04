const mongoose = require("mongoose");
const Endereco = require("./EnderecoModel");

const ClienteSchema = new mongoose.Schema({
  cpf: { type: String },
  nome: { type: String },
  telefone: { type: String },
  email: { type: String },
  cnpj: { type: String },
  nomeFantasia: { type: String },
  razaoSocial: { type: String },
  criadoEm: { type: Date, default: Date.now },
  enderecos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Endereco" }]
});

const ClienteModel = mongoose.model("Cliente", ClienteSchema);

function Cliente(body) {
  this.body = body;
  this.errors = [];
  this.success = [];
  this.cliente = null;
}

Cliente.prototype.registerCliente = async function () {
  //this.valida();
  //if (this.errors.length > 0) return;

  await this.userExists();

  if (this.errors.length > 0) return;

  this.success.push("Cliente cadastrado com sucesso");
  this.cliente = await ClienteModel.create(this.body.cliente);

  // this.body.enderecos.map(endereco => {
  //   endereco.id_cliente = cliente.id
  //   EnderecoModel.create(endereco)
  // })
};

Cliente.prototype.registerAdresses = async function () {
  //this.validaAdress();
  //if (this.errors.length > 0) return;

  for (const DadosEndereco of this.body.enderecos) {
    DadosEndereco.clienteId = this.cliente._id;
    const endereco = new Endereco(DadosEndereco);
    const enderecoCadastrado = await endereco.register();
    this.cliente.enderecos.push(enderecoCadastrado);
  }

  await this.cliente.save();
};

Cliente.prototype.userExists = async function () {
  if (this.body.cliente.cnpj || false) {
    const clientePJ = await ClienteModel.findOne({
      cnpj: this.body.cliente.cnpj || "",
    });
    if (clientePJ) this.errors.push("Cliente PJ já existe no banco de dados");
  }
  if (this.body.cliente.cpf || false) {
    const clientePF = await ClienteModel.findOne({
      cpf: this.body.cliente.cpf || "",
    });
    if (clientePF) this.errors.push("Cliente já existe no banco de dados");
  }
};

Cliente.prototype.valida = function () {
  //this.cleanUp();

  // if (!this.body.cliente.nome) this.errors.push("Nome é um campo obrigatório");
  //if (!this.body.cnpj) this.errors.push("CNPJ é um campo obrigatório");
  // if (!this.body.cliente.telefone)
  //   this.errors.push("Telefone é um campo obrigatório");
};

Cliente.prototype.cleanUp = function () {
  for (const key in this.body) {
    if (typeof this.body[key] !== "string") {
      this.body[key] = "";
    }
  }
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
  const cliente = await ClienteModel.find().sort({
    criadoEm: -1,
  });
  return cliente;
};

Cliente.buscarClientesPF = async function () {
  const clientePF = await ClienteModel.find({ cpf: { $gt: 1 } }).
    populate("enderecos").
    sort({
      criadoEm: -1,
    })
  return clientePF;
};

Cliente.buscarClientesPJ = async function () {
  const clientePJ = await ClienteModel.find({ cnpj: { $gt: 1 } }).
  populate("enderecos").
  sort({
    criadoEm: -1,
  });
  return clientePJ;
};

module.exports = Cliente;
