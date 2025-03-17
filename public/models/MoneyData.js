const mongoose = require("mongoose");

const MoneyDonationSchema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true,
    },
    Last_Name: {
        type: String,
        required: true,
    },

    Mobile_Number: {
        type: Number,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    // New fields for payment tracking
    order_id: {
        type: String,
        unique: true,
        sparse: true
    },
    payment_status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING'
    },
    payment_date: {
        type: Date
    },
    transaction_id: {
        type: String
    }
}, { timestamps: true });

const MoneyDonation = new mongoose.model("MoneyDonation", MoneyDonationSchema);

module.exports = MoneyDonation;