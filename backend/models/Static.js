const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    playerId: { type: String, required: true }, 
    name: { type: String, required: true }, 
    lodestoneID: { type: String, required: true }, 
    role: { type: String, enum: ['Tank', 'Healer', 'DPS'], required: true }, 
    class: { type: String, required: true }, 
    data: { type: mongoose.Schema.Types.Mixed }, 
});


const staticSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    members: {
        type: [memberSchema]
    },
    isComplete: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Metodo per verificare se il team è completo e con la giusta composizione
staticSchema.methods.validateComposition = function() {
    const rolesCount = {
        Tank: 0,
        Healer: 0,
        DPS: 0
    };

    this.members.forEach(member => rolesCount[member.role]++);

    return rolesCount.Tank === 2 && rolesCount.Healer === 2 && rolesCount.DPS === 4;
};

module.exports = mongoose.model('Static', staticSchema);
