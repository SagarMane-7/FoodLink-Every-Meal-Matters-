# FoodLink: Every Meal Matters 🍲🤝

**FoodLink** is a full-stack web platform designed to bridge the gap between surplus food and those in need. It connects hotels, restaurants, and individual donors with NGOs, ensuring that leftover food is efficiently redistributed to combat hunger and reduce food waste.

---

## 🚀 Key Features

### 🏢 For NGOs
- **Registration & Authentication**: Secure onboarding for NGOs with automated email confirmation.
- **NGO Dashboard**: A dedicated space to view available food donations in real-time.
- **Accept Donations**: NGOs can claim specific donations, triggering automated email alerts to both the donor and the NGO for coordination.
- **Donation History**: Track past accepted donations and manage NGO profiles.

### 🍱 For Donors (Hotels/Individuals)
- **Food Donation Form**: Quick and easy form to list surplus food, including category, quantity, and pickup location/time.
- **Money Donation**: Integration with payment gateways (Cashfree) for those who wish to contribute financially.
- **Automated Alerts**: Receive instant email notifications when a donation is accepted by an NGO.

### 📱 General
- **Responsive UI**: A modern, clean, and accessible design optimized for both desktop and mobile users.
- **Real-time Impact**: Direct connection between donors and NGOs for immediate action.

---

## 🛠️ Tech Stack

- **Frontend**: EJS (Embedded JavaScript), Vanilla CSS, JavaScript.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Communication**: Nodemailer for automated email notifications.
- **Payments**: Cashfree PG integration.

---

## 📂 Project Structure

```text
├── app.js               # Main application entry point & routes
├── public/              # Static assets (CSS, JS, Images, Models)
│   ├── models/          # Mongoose Schemas & Email Logic
│   └── stylesheet/      # CSS Files
├── views/               # EJS Templates for UI
├── .env.example         # Template for environment variables
└── package.json         # Project dependencies & scripts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) instance (Local or Atlas).
- Gmail App Password (for Nodemailer).

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/FoodLink.git
   cd FoodLink
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add:
   ```env
   PORT=8080
   MONGO_URL=your_mongodb_connection_string
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   ```

4. **Run the application**:
   - For development (with nodemon):
     ```bash
     npm run dev
     ```
   - For production:
     ```bash
     npm start
     ```

5. **Access the platform**:
   Open your browser and navigate to `http://localhost:8080`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve FoodLink.

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

**Together, let's ensure no meal goes to waste. 🌍💙**
