const axios = require('axios');

const DATA_CENTER_API_URL = 'https://api.xivstatus.com/api/data-centers';
const SERVER_API_URL = 'https://api.xivstatus.com/api/servers';

const fetchDataCenterStatus = async () => {
    try {
        const response = await axios.get(DATA_CENTER_API_URL, { timeout: 10000 });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from data-center API:', error.message);
        return null;
    }
};

const fetchServerStatus = async () => {
    try {
        const response = await axios.get(SERVER_API_URL, { timeout: 10000 });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from server API:', error.message);
        return null;
    }
};

module.exports = { fetchDataCenterStatus, fetchServerStatus };
