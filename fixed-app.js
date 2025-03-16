const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Registration = require("./public/models/RegistrationData.js");
const FoodDonation = require("./public/models/FoodData.js");
const MoneyDonation = require("./public/models/MoneyData.js");
const AcceptedDonation = require("./public/models/Acepted.js");

// Middleware
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodlink';
console.log('Attempting to connect to MongoDB...');

// Connect to MongoDB with increased timeout and proper options
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
})
.then(() => {
  console.log("MongoDB connection successful");
  
  // Configure session with MongoStore after successful MongoDB connection
  app.use(session({
    secret: process.env.SESSION_SECRET || '6743ee90b6a4aba6a00ace6c8b770539a3fa580e01687cd1167c38857d6e9df3',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // = 14 days
      crypto: {
        secret: process.env.SESSION_SECRET || '6743ee90b6a4aba6a00ace6c8b770539a3fa580e01687cd1167c38857d6e9df3'
      }
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' }
  }));
  
  // Only start the server after successful MongoDB connection
  const port = process.env.PORT || 8080;
  app.listen(port, () => {
    console.log(`App is listening on ${port}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit the process if MongoDB connection fails
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
  try {
    req.session.destroy();
    const accepteddonations = await AcceptedDonation.find().exec();
    const availabledonations = await FoodDonation.find().exec();
    res.render("FoodLink.ejs", {accepteddonations, availabledonations});
  } catch (error) {
    console.error("Error in root route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
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

app.get("/donation-successful", (req, res) => {
  res.render("DonationSucessfull.ejs");
});

app.post("/Login", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const UserName = await Registration.findOne({ Email }).exec();
    if (UserName && UserName.Setpassword === Password) {
      req.session.user = Email;
      console.log("Logged in Sucessfully.")
      const availabledonations = await FoodDonation.find().exec();
      const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user }).exec();
      res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });
    } else {
      res.render("Login.ejs", { error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

app.post("/Register", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

app.post("/DonateFood", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error in donate food route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

app.post("/DonateMoney", async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error in donate money route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

//Dashboard
app.get("/dashboard", islogged, async (req, res) => {
  try {
    const availabledonations = await FoodDonation.find().exec();
    const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user }).exec();
    res.render('Dashboard.ejs', { availabledonations, accepteddonations: accepteddonations || [] });
  } catch (error) {
    console.error("Error in dashboard route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

app.get("/profile", islogged, async (req, res) => {
  try {
    const userEmail = req.session.user;
    const profiles = await Registration.findOne({ Email: userEmail }).exec();
    res.render("Profile.ejs", { profiles });
  } catch (error) {
    console.error("Error in profile route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

app.get("/history", islogged, async (req, res) => {
  try {
    const accepteddonations = await AcceptedDonation.find({ Accepted_By: req.session.user }).exec();
    res.render("History.ejs", { accepteddonations });
  } catch (error) {
    console.error("Error in history route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
});

app.post('/accept-donation/:id', islogged, async (req, res) => {
  try {
    const donationId = new mongoose.Types.ObjectId(req.params.id);
    const availabledonation = await FoodDonation.findById(donationId).lean().exec();

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
      Accepted_By: req.session.user
    });

    await acceptedDonation.save();
    await FoodDonation.findByIdAndDelete(donationId);
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in accept donation route:", error);
    res.status(500).send("Database error. Please try again later.");
  }
}); 