const mongoose = require("mongoose");

const comerceSchema = new mongoose.Schema(
    {
        Nombre_del_comercio: { 
            type: String, 
            required: [true, 'El nombre del comercio es obligatorio.'],
            minlength: [3, 'El nombre del comercio debe tener al menos 3 caracteres.']
        },
        CIF: { 
            type: Number, 
            required: [true, 'El CIF es obligatorio.'],
            min: [10000000, 'El CIF debe ser un número válido.']
        },
        password: { 
            type: String, 
            required: [true, 'La contraseña es obligatoria.'],
            minlength: [6, 'La contraseña debe tener al menos 6 caracteres.'],
        
        },
        email: { 
            type: String, 
            unique: true, 
            required: [true, 'El correo electrónico es obligatorio.'],
            match: [/.+\@.+\..+/, 'Por favor ingrese un correo electrónico válido.']
        },
        Telefono_de_contacto: { 
            type: Number, 
            required: [true, 'El teléfono de contacto es obligatorio.'],
            min: [100000000, 'El teléfono de contacto debe ser un número válido.']
        },
        role: {
            type: String,
            default: 'admin',
            required: [true, 'El rol es obligatorio'],
            enum: ['admin']
        }
    },
    { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("comerce", comerceSchema);