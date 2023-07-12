const mongoose = require("../database/mongo");

const eventoSchema = new mongoose.Schema(
  {
    titulo: String,
    descricao: String,
    dataInicio: { type: Date, default: Date.now },
    dataFim: { type: Date, default: Date.now },
    localizacao: String,
  },
  { collection: "evento" }
);

eventoSchema.index(
  { titulo: "text", descicao: "text" },
  { default_language: "pt", weights: { titulo: 2, descricao: 1 } }
);

const Evento = mongoose.model("Evento", eventoSchema);

module.exports = Evento;