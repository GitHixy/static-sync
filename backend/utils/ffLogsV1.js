const axios = require('axios');

async function fetchCharacterParsesV1(name, serverSlug, serverRegion) {
    const response = await axios.get(
        `https://www.fflogs.com/v1/parses/character/${name}/${serverSlug}/${serverRegion}`,
        {
            params: { api_key: process.env.FF_LOGS_API_KEY },
        }
    );

    return response.data;
}

module.exports = { fetchCharacterParsesV1 };