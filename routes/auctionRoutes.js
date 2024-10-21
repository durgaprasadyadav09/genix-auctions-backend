const express = require('express');
const { 
    createAuction, 
    getAllAuctions, 
    getAuctionById, 
    updateAuction, 
    deleteAuction, 
    placeBid, 
    getBidsForAuction 
} = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const router = express.Router();

// Route to create a new auction (Protected)
router.post(
    '/',
    protect,
    [
      body('title').not().isEmpty().withMessage('Title is required'),
      body('description').not().isEmpty().withMessage('Description is required'),
      body('startingBid').isNumeric().withMessage('Starting bid must be a number'),
      body('endDate').isISO8601().withMessage('End date must be a valid date'),
    ],
    createAuction
  );

// Route to get all auctions (Public)
router.get('/', getAllAuctions);

// Route to get a single auction by ID (Public)
router.get('/:id', getAuctionById);

// Route to update an auction (Protected)
router.put(
    '/:id',
    protect,
    [
      body('title').optional().not().isEmpty().withMessage('Title cannot be empty'),
      body('description').optional().not().isEmpty().withMessage('Description cannot be empty'),
      body('startingBid').optional().isNumeric().withMessage('Starting bid must be a number'),
      body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    ],
    updateAuction
  );

// Route to delete an auction (Protected)
router.delete('/:id', protect, deleteAuction);

// Route to place a bid on an auction (Protected)
router.post('/:id/bid', protect, placeBid);

// Route to get bids for an auction (Public)
router.get('/:id/bids', getBidsForAuction);

module.exports = router;
