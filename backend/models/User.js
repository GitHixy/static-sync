const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    isAdmin: { type: Boolean, default: false },
    discord: {
        id: { type: String, unique: true }, 
        username: { type: String }, 
        discriminator: { type: String }, 
        avatar: { type: String }, 
    },
    statics: [{ 
                    staticId: { type: mongoose.Schema.Types.ObjectId, ref: 'Static' },
                    name: { type: String, required: true } }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
