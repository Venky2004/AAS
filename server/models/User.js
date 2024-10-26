const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone_number: String,
  name: String,
  age: Number,
  address: String,
  email: String,
  password: String,
  role: String,
  location: { lat: Number, lon: Number },
});

module.exports = mongoose.model('User', userSchema);
