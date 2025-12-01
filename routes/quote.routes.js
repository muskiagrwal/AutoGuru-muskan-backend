const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    requestQuote,
    getUserQuotes,
    getMechanicQuotes,
    respondToQuote,
    acceptQuote,
    rejectQuote
} = require('../controllers/quote.controller');

// All quote routes require authentication
router.use(protect);

router.post('/', requestQuote);
router.get('/user', getUserQuotes);
router.get('/mechanic', getMechanicQuotes);
router.put('/:id/respond', respondToQuote);
router.put('/:id/accept', acceptQuote);
router.put('/:id/reject', rejectQuote);

module.exports = router;
