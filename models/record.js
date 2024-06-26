const mongoose = require("mongoose");

const recordsSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    description: { type: String, required: true },
    inVoice: { type: Number, required: true },
    dop: { type: String, default: new Date(), required: true },
    company: { type: String, required: true },
    rate: { type: Number, required: true, min: 0 },
    taxType: { type: String, required: true },
    percentage: { type: Number, required: true, min: 0 },
    delivery: { type: Number, required: true, default: 0, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    warranty: { type: String, default: new Date(), required: true },
    isVerified: { type: Boolean, default: false }
});

const Record = mongoose.model('Record', recordsSchema);

module.exports = Record;