const express = require('express');
const { fetchCharacterDataV2 } = require('../utils/ffLogsV2');
const router = express.Router();

router.get('/character/:name/:serverSlug/:serverRegion', async (req, res) => {
    try {
        const { name, serverSlug, serverRegion } = req.params;
        console.log("Parameters received:", name, serverSlug, serverRegion);
        const characterData = await fetchCharacterDataV2(name, serverSlug, serverRegion);
        res.json(characterData);
    } catch (error) {
        console.error('Error fetching character data:', error.message);
        res.status(500).json({ message: 'Failed to fetch character data' });
    }
});

module.exports = router;

