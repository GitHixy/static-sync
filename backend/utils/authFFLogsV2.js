const axios = require('axios');

async function getFFLogsToken() {
    try {
        const response = await axios.post('https://www.fflogs.com/oauth/token', {
            grant_type: 'client_credentials',
            client_id: process.env.FF_LOGS_CLIENT_ID,
            client_secret: process.env.FF_LOGS_CLIENT_SECRET,
        }, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching FF Logs token:', error.response?.data || error.message);
        throw new Error('Failed to fetch FF Logs token');
    }
}

module.exports = { getFFLogsToken };
