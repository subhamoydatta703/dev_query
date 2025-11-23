const mongoose = require("mongoose");
require("dotenv").config();
// perform db connection

async function connectionDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");
  } catch (error) {
    console.log("DB not connected: ", error);
  }
}

module.exports = connectionDB;