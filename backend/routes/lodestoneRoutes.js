const express = require('express');
const { fetchNews, fetchMaintenance } = require('../utils/lodestone');
const router = express.Router();

router.get('/news', fetchNews);
router.get('/maintenance', fetchMaintenance);

module.exports = router;
