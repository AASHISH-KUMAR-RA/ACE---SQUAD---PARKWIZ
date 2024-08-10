const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    slotNos: {
        type: [Number],
        required: true,
    },
    quantity: {
        type: Number,
        default: 1,
        required: true,
    },
    status: {
        type: String,
        default:"Booked"
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    paidAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
module.exports = Order;
