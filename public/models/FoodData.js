const mongoose = require("mongoose");

const FoodDonationSchema = new mongoose.Schema({
    First_Name: {
        type: String,
        required: true,
    },
    Last_Name: {
        type: String,
        required: true,
    },
    Mobile: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Food_Category: {
        type: String,
        required: true
    },
    Donation_Date: {
        type: String,
        required: true
    },
    Time: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    }
})

const FoodDonation = mongoose.model("FoodDonation", FoodDonationSchema);

module.exports = FoodDonation;