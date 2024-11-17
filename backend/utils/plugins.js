const axios = require('axios');

const BASE_URL = 'https://api.xivplugins.com'


const fetchACTPlugins = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/act/plugins`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ACT plugins:', error.message);
        throw new Error('Failed to fetch ACT plugins');
    }
};

const fetchACTOverlays = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/act/overlays`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ACT overlays:', error.message);
        throw new Error('Failed to fetch ACT overlays');
    }
};

const fetchDalamudPlugins = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/dalamud/plugins`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Dalamud plugins:', error.message);
        throw new Error('Failed to fetch Dalamud plugins');
    }
};

const fetchDalamudRepos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/dalamud/repos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Dalamud repos:', error.message);
        throw new Error('Failed to fetch Dalamud repos');
    }
};

module.exports = {
    fetchACTPlugins,
    fetchACTOverlays,
    fetchDalamudPlugins,
    fetchDalamudRepos,
};
