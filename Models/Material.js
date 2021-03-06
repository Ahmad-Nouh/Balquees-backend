const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number,
        default: 0
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse'
    },
    weightPerMeter: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date
    }
});

const Material = mongoose.model('Material', schema);

module.exports.Material = Material;
module.exports.MaterialSchema = schema;