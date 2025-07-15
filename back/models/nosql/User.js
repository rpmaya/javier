const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definición del esquema de Usuario
const UserSchema = new mongoose.Schema({
    Nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    Password: {
        type: String,
        required: true
    },
    Edad: {
        type: Number,
        required: true,
        min: 0
    },
    Ciudad: {
        type: String,
        required: true,
        trim: true
    },
    Intereses: {
        type: [String],
        default: []
    },
    PermiteRecibirOfertas: {
        type: Boolean,
        default: false
    },
    Role: {
        type: String,
        enum: ['user', 'admin', 'merchant'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
    if (!this.isModified('Password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.Password = await bcrypt.hash(this.Password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.Password);
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = mongoose.model('User', UserSchema);