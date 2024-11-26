const express = require('express');
const { fetchChannelMessages } = require('../config/discordConfig');
const router = express.Router();

router.get('/dalamud-news', async (req, res) => {
    const channelId = process.env.DALAMUD_CHANNEL_ID;
    const messages = await fetchChannelMessages(channelId);
    res.json(messages);
});

module.exports = router;
