const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  endDate: { type: Date, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
});

module.exports = mongoose.model('Auction', auctionSchema);
