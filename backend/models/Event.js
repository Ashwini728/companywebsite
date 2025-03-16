const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: String,
  participants: [
    {
      playerName: String,
      contact: String,
      paymentStatus: Boolean,
    },
  ],
});

module.exports = mongoose.model('Event', eventSchema);
