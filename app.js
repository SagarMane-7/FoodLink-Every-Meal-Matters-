require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const Registration = require("./public/models/RegistrationData.js");
const FoodDonation = require("./public/models/FoodData.js");
const MoneyDonation = require("./public/models/MoneyData.js");
const AcceptedDonation = require("./public/models/Acepted.js");
const sendEmail = require("./public/models/email.js");

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: '6743ee90b6a4aba6a00ace6c8b770539a3fa580e01687cd1167c38857d6e9df3',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully.");
});

// Middleware
const islogged = (req, res, next) => {
  if (req.session.user) {
    next();
  }
  else {
    res.render("Login.ejs");
  }
}

// User Interface
app.get("/", async (req, res) => {
  req.session.destroy();
  const accepteddonations = await AcceptedDonation.find() || [];
  const availabledonations = await FoodDonation.find() || [];
  res.render("FoodLink.ejs", { accepteddonations, availabledonations });
});

app.get("/Login", (req, res) => {
  res.render("Login.ejs");
});

app.get("/aboutus", (req, res) => {
  res.render("Aboutus.ejs");
});

app.get("/Register", async (req, res) => {
  res.render("Registration.ejs");
});

app.get("/DonateFood", (req, res) => {
  res.render("FoodDonation.ejs");
});

app.get("/DonateMoney", (req, res) => {
  res.render("MoneyDonation.ejs");
});

app.post("/Login", async (req, res) => {
  const { Email, Password } = req.body;
  const UserName = await Registration.findOne({ Email });

  if (UserName && UserName.Setpassword === Password) {
    req.session.user = Email;
    console.log("Logged in Successfully.");
    const availabledonations = await FoodDonation.find();
    const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user });
    res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });
  } else {
    console.log("Invalid Email or Password.");
    res.redirect("/Login");
  }
});

app.post("/Register", async (req, res) => {
  const { NGOName, TrustID, PANID, DARPANID, Address, CountryCode, Mobile, Email, Setpassword, Confirmpassword } = req.body;

  const Registered = new Registration({
    NGOName,
    TrustID,
    PANID,
    DARPANID,
    Address,
    CountryCode,
    Mobile,
    Email,
    Setpassword,
    Confirmpassword,
  });

  await Registered.save();
  console.log("Registered Successfully.");

  // Send welcome email
  sendEmail(
    Email,
    "Welcome to FoodLink – Your NGO is Now Onboard",
    `
    <h2>Welcome to FoodLink!</h2>

    <p>Dear <strong>${NGOName}</strong>,</p>

    <p>We are delighted to welcome your NGO to <strong>FoodLink</strong>, where we work together to reduce food waste and support communities in need.</p>

    <p>Your registration is now complete, and your dashboard is fully active.</p>

    <hr>

    <p><strong>🔐 Login Credentials</strong><br>
    Email: <strong>${Email}</strong><br>
    Password: <strong>${Setpassword}</strong></p>

    <hr>

    <p>You’re now ready to make a meaningful impact. Log in to your dashboard, accept donations, and help ensure that surplus food reaches those who need it most.</p>

    <p>👉 <a href="https://foodlink-every-meal-matters-5dl4.onrender.com/Login">Click here to log in and get started</a></p>

    <p>Thank you for joining our mission. Together, we can make a difference — one meal at a time.</p>

    <p>Warm regards,<br><strong>Team FoodLink</strong></p>
    `
  );

  const accepteddonations = await AcceptedDonation.find() || [];
  const availabledonations = await FoodDonation.find() || [];
  res.render("FoodLink.ejs", { accepteddonations, availabledonations });
});

app.post("/DonateFood", async (req, res) => {
  const { First_Name, Last_Name, Mobile, Email, Address, Food_Category, Donation_Date, Time, Description } = req.body;

  const DonateFood = new FoodDonation({
    First_Name,
    Last_Name,
    Mobile,
    Email,
    Address,
    Food_Category,
    Donation_Date,
    Description,
    Time
  });

  await DonateFood.save();
  console.log("Data Saved Successfully.");
  res.render("DonationSucessfull.ejs");
});

app.post("/DonateMoney", async (req, res) => {
  const { First_Name, Last_Name, Mobile_Number, Email, Amount } = req.body;

  const DonateMoney = new MoneyDonation({
    First_Name,
    Last_Name,
    Mobile_Number,
    Email,
    Amount
  });

  await DonateMoney.save();
  console.log("Data Saved Successfully.");
  res.render("DonationSucessfull.ejs");
});

// Dashboard
app.get("/dashboard", islogged, async (req, res) => {
  const availabledonations = await FoodDonation.find();
  const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user });
  res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });
});

app.get("/profile", islogged, async (req, res) => {
  console.log("Session User:", req.session.user);
  const userEmail = req.session.user;
  const profiles = await Registration.findOne({ Email: userEmail });
  res.render("Profile.ejs", { profiles });
});

app.get("/history", islogged, async (req, res) => {
  console.log("Session User:", req.session.user);
  const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user });
  res.render('History.ejs', { accepteddonations: accepteddonations || [] });
});

app.post('/accept-donation/:id', islogged, async (req, res) => {
  const donationId = new mongoose.Types.ObjectId(req.params.id);
  const availabledonation = await FoodDonation.findById(donationId).lean();

  const acceptedDonation = new AcceptedDonation({
    First_Name: availabledonation.First_Name,
    Last_Name: availabledonation.Last_Name,
    Mobile: availabledonation.Mobile,
    Email: availabledonation.Email,
    Address: availabledonation.Address,
    Food_Category: availabledonation.Food_Category,
    Donation_Date: availabledonation.Donation_Date,
    Time: availabledonation.Time,
    Description: availabledonation.Description,
    Accepted_By: req.session.user
  });

  await acceptedDonation.save();
  await FoodDonation.findByIdAndDelete(donationId);

  const availabledonations = await FoodDonation.find();
  const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user });
  res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });

  const profiles = await Registration.findOne({ Email: req.session.user });

  sendEmail(
    availabledonation.Email,
    "Your Food Donation Has Been Accepted!",
    `
    <p>Dear ${availabledonation.First_Name} ${availabledonation.Last_Name},</p>
    <p>Thank you for your generous food donation through <strong>FoodLink</strong>.</p>
    <p>Your donation has been accepted by the following NGO:</p>
    <p><strong>NGO Details:</strong><br>
    Name: ${profiles.NGOName}<br>
    Mobile: ${profiles.Mobile}<br>
    Email: ${profiles.Email}</p>
    <p><strong>Donation Details:</strong><br>
    Food Category: ${availabledonation.Food_Category}<br>
    Pickup Address: ${availabledonation.Address}<br>
    Preferred Time: ${availabledonation.Time} on ${availabledonation.Donation_Date}<br>
    Description: ${availabledonation.Description}</p>
    <p>The NGO will contact you shortly to arrange the pickup.</p>
    <p>– Team FoodLink</p>
    `
  );

  sendEmail(
    req.session.user,
    "You Accepted a Food Donation via FoodLink",
    `
    <p>Dear ${profiles.NGOName},</p>
    <p>You have successfully accepted a food donation through <strong>FoodLink</strong>.</p>
    <p><strong>Donor Details:</strong><br>
    Name: ${availabledonation.First_Name} ${availabledonation.Last_Name}<br>
    Mobile: ${availabledonation.Mobile}<br>
    Email: ${availabledonation.Email}</p>
    <p><strong>Donation Details:</strong><br>
    Food Category: ${availabledonation.Food_Category}<br>
    Pickup Address: ${availabledonation.Address}<br>
    Preferred Time: ${availabledonation.Time} on ${availabledonation.Donation_Date}<br>
    Description: ${availabledonation.Description}</p>
    <p>Please contact the donor to coordinate the pickup.</p>
    <p>– Team FoodLink</p>
    `
  );
});
