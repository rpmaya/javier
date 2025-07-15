const mongoose = require("mongoose");

const comerceSchema = new mongoose.Schema(
    {
        Nombre_del_comercio: { type: String },
        CIF: { type: Number },
        Direccion: { type: String },
        email: { type: String, unique: true },
        Telefono_de_contacto: { type: Number}
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("comerce", comerceSchema);
