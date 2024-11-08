const { buildSdk } = require('@rpglogs/api-sdk');
const axios = require('axios');

// Function to get an access token from FF Logs and initialize the SDK
async function getFFLogsSdk() {
    try {
        // Fetch the access token
        const response = await axios.post('https://www.fflogs.com/oauth/token', {
            grant_type: 'client_credentials',
            client_id: process.env.FF_LOGS_CLIENT_ID,
            client_secret: process.env.FF_LOGS_CLIENT_SECRET,
        });

        const accessToken = response.data.access_token;

        // Initialize the SDK with the access token for Final Fantasy XIV
        const ffSdk = buildSdk(accessToken, 'ff');
        return ffSdk;
    } catch (error) {
        console.error('Error fetching FF Logs token:', error.response?.data || error.message);
        throw new Error('Failed to initialize FF Logs SDK');
    }
}

module.exports = { getFFLogsSdk };
