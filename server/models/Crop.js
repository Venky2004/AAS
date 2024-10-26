const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  datetime_created: { type: Date, default: Date.now },
  description: String,
  price: Number,
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'available' },
  accepted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bargained_price: Number,
  delivered_by: String,
  photos: [String],
});

module.exports = mongoose.model('Crop', cropSchema);
