const express = require('express');
const {
    fetchACTPlugins,
    fetchACTOverlays,
    fetchDalamudPlugins,
    fetchDalamudRepos,
} = require('../utils/plugins');

const router = express.Router();

router.get('/act/plugins', async (req, res) => {
    try {
        const plugins = await fetchACTPlugins();
        res.status(200).json(plugins);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ACT plugins', error: error.message });
    }
});

router.get('/act/overlays', async (req, res) => {
    try {
        const overlays = await fetchACTOverlays();
        res.status(200).json(overlays);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch ACT overlays', error: error.message });
    }
});

router.get('/dalamud/plugins', async (req, res) => {
    try {
        const plugins = await fetchDalamudPlugins();
        res.status(200).json(plugins);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Dalamud plugins', error: error.message });
    }
});

router.get('/dalamud/repos', async (req, res) => {
    try {
        const repos = await fetchDalamudRepos();
        res.status(200).json(repos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch Dalamud repos', error: error.message });
    }
});

module.exports = router;
