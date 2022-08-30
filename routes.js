const express = require("express");
const route = express.Router();

const homeController = require("./src/controllers/homeController");
const loginController = require("./src/controllers/loginController");
const pedidoController = require("./src/controllers/pedidoController");
const clienteController = require("./src/controllers/clienteController");
const contaController = require("./src/controllers/contaController");
const origemController = require("./src/controllers/origemController");

const { loginRequired } = require("./src/middlewares/middleware");

// Rotas da home
route.get("/", loginRequired, homeController.index);

// Rotas de login
route.get("/login/", loginController.index);
route.post("/login/login", loginController.login);
route.get("/login/logout", loginController.logout);

// Rotas de pedidos
route.get("/pedido", loginRequired, pedidoController.index);
route.post("/pedido/register", loginRequired, pedidoController.register);
route.get("/pedido/:id", loginRequired, pedidoController.editIndex);
route.post("/pedido/edit/:id", loginRequired, pedidoController.edit);

// Rotas de clientes
route.get("/cliente/home", loginRequired, homeController.clienteIndex);

route.post("/cliente/buscaCEP", clienteController.buscaCEP);
route.get("/cliente", loginRequired, clienteController.index);
route.post("/cliente/register", loginRequired, clienteController.register);
route.get("/cliente/:id", loginRequired, clienteController.editIndex);
route.post("/cliente/edit/:id", loginRequired, clienteController.edit);

// Rotas de tipos de contas
route.get("/conta/home", loginRequired, homeController.contaIndex);

route.get("/conta", loginRequired, contaController.index);
route.post("/conta/register", loginRequired, contaController.register);
route.get("/conta/:id", loginRequired, contaController.editIndex);
route.post("/conta/edit/:id", loginRequired, contaController.edit);

// Rotas de tipos de contas
route.get("/origem/home", loginRequired, homeController.origemIndex);

route.get("/origem", loginRequired, origemController.index);
route.post("/origem/register", loginRequired, origemController.register);
route.get("/origem/:id", loginRequired, origemController.editIndex);
route.post("/origem/edit/:id", loginRequired, origemController.edit);

module.exports = route;
