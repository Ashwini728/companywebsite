const express = require('express');
const router = express.Router();
const { registerPlayer, getMatchTable } = require('../controllers/esportsController');

router.post('/register', registerPlayer);
router.get('/match-table', getMatchTable);

module.exports = router;
