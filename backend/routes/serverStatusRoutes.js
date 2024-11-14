const express = require('express');
const { fetchDataCenterStatus, fetchServerStatus } = require('../utils/serverStatus');
const router = express.Router();

router.get('/server-status', async (req, res) => {
    const dataCenters = await fetchDataCenterStatus();
    const servers = await fetchServerStatus();

    if (!dataCenters || !servers) {
        return res.status(500).json({ error: 'Error fetching data from external API' });
    }

    const regionStatuses = dataCenters.map((dataCenter) => {
        const regionServers = servers.filter(server => server.data_center && server.data_center.name === dataCenter.name);
        return {
            ...dataCenter,
            servers: regionServers
        };
    });
    
    res.json(regionStatuses);
});

module.exports = router;