const mongoose = require("../database/mongo");

const usuarioSchema = new mongoose.Schema(
  {
    nome: String,
    email: { type: String, unique: true },
    password: String,
  },
  { collection: "usuario" }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;