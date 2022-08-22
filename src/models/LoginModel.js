const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model("Login", LoginSchema);

class Login {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = {
      email: "admin@admin.com",
      password: "admin",
    };
  }

  valida() {
    this.cleanUp();
    //Email
    if (this.body.email !== "admin@admin.com")
      this.errors.push("E-mail inválido");

    //Senha
    if (this.body.password !== "admin") this.errors.push("Senha inválida");

    //Errrors
    if (this.errors.length > 0) return;
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    };
  }
}

module.exports = Login;
