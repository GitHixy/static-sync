const axios = require('axios');

const fetchNews = async (req, res) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.LODESTONE_NEWS,
        headers: {}
    };
    try {
        const response = await axios(config);
        res.send(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Failed to fetch news', details: error.message });
    }
};

const fetchMaintenance = async (req, res) => {
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.LODESTONE_MAINTENANCE,
        headers: {}
    };
    try {
        const response = await axios(config);
        res.send(response.data);
    } catch (error) { 
        res.status(500).json({ message: 'Failed to fetch maintenance data', details: error.message });
    }
};

module.exports = { fetchNews, fetchMaintenance };
