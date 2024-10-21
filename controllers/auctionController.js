const { validationResult } = require('express-validator');
const Auction = require('../models/Auction');
const Bid = require('../models/Bid');

// Create a new auction
exports.createAuction = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startingBid, endDate } = req.body;

  try {
    const auction = new Auction({
      title,
      description,
      startingBid,
      endDate,
      user: req.user.id,
    });

    await auction.save();
    res.status(201).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all auctions
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate('user', 'username');
    res.status(200).json(auctions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific auction by ID
exports.getAuctionById = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id).populate('user', 'username');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an auction
exports.updateAuction = async (req, res) => {
  const { id } = req.params;

  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if the user owns the auction
    if (auction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Update auction fields
    auction.title = req.body.title || auction.title;
    auction.description = req.body.description || auction.description;
    auction.startingBid = req.body.startingBid || auction.startingBid;
    auction.endDate = req.body.endDate || auction.endDate;

    await auction.save();
    res.status(200).json(auction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an auction
exports.deleteAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if the user owns the auction
    if (auction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await auction.deleteOne();
    res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Place a bid on an auction
exports.placeBid = async (req, res) => {
  const { id } = req.params;
  const { bidAmount } = req.body;

  try {
    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    // Check if the bid is higher than the current highest bid
    if (bidAmount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than the current bid' });
    }

    // Create a new bid
    const bid = new Bid({
      auction: id,
      user: req.user.id,
      bidAmount,
    });

    await bid.save();

    // Update auction current bid and bids array
    auction.currentBid = bidAmount;
    auction.bids.push(bid._id);
    await auction.save();

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get bid history for an auction
exports.getBidsForAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id).populate('bids');

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    res.status(200).json(auction.bids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
