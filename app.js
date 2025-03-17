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
  console.log("✅ MongoDB connected successfully.");
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

//User Interface

app.get("/", async(req, res) => {
  req.session.destroy();
  const accepteddonations = await AcceptedDonation.find()
  const availabledonations = await FoodDonation.find();
  res.render("FoodLink.ejs",{accepteddonations,availabledonations});
});

app.get("/Login", (req, res) => {
  res.render("Login.ejs");
});

app.get("/Register", (req, res) => {
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
    console.log("Logged in Sucessfully.")
    const availabledonations = await FoodDonation.find();
    const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user })
    res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });
  }
}
);

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
  console.log("Registerd Sucessfully.")
  res.render("FoodLink.ejs");
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
  console.log("Data Saved Sucessfully.")
  res.render("DonationSucessfull.ejs");

}
);

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
  console.log("Data Saved Sucessfully.")
  res.render("DonationSucessfull.ejs");
}
);

//Dashboard

app.get("/dashboard", islogged, async (req, res) => {
  const availabledonations = await FoodDonation.find();
  const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user })
  res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });
})

app.get("/history", islogged, async (req, res) => {
  const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user })
  res.render('History.ejs', { accepteddonations: accepteddonations || [] });
})


app.get("/profile", islogged, async (req, res) => {
  const userEmail = req.session.user;
  const profiles = await Registration.findOne({ Email: userEmail });
  res.render("Profile.ejs", { profiles });
})

app.post('/accept-donation/:id',islogged, async (req, res) => {
  const donationId = new mongoose.Types.ObjectId(req.params.id);
  const availabledonation = await FoodDonation.findById(donationId).lean();

  if (!availabledonation) {
    console.log("Donation not found!");
    return res.status(404).send("Donation not found...");
  }

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
    Accepted_By:req.session.user
  });

  await acceptedDonation.save();
  await FoodDonation.findByIdAndDelete(donationId);
  res.redirect("/dashboard");
});