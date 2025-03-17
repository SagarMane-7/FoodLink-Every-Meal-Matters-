const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
    NGOName: {
        type: String,
        required: true,
        unique: true
    },
    TrustID: {
        type: String,
        required: true,
        unique: true
    },
    PANID: {
        type: String,
        required: true,
        unique: true,

    },
    DARPANID: {
        type: String,
        unique: true
    },
    Address: {
        type: String,
        required: true
    },
    CountryCode: {
        type: String,
        required: true
    },
    Mobile: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Setpassword: {
        type: String,
        required: true
    },
    Confirmpassword: {
        type: String,
        required: true
    }
})

const Registration = new mongoose.model("Registration", RegistrationSchema);

module.exports = Registration;