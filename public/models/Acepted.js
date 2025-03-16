const mongoose = require('mongoose');

const AcceptedDonationsSchema = new mongoose.Schema({
    First_Name: String,
    Last_Name: String,
    Mobile: String,
    Email: String,
    Address: String,
    Food_Category: String,
    Donation_Date: String,
    Time: String,
    Description: String,
    Accepted_By: String
});

const AcceptedDonation = mongoose.model("AcceptedDonations", AcceptedDonationsSchema);
module.exports = AcceptedDonation;
