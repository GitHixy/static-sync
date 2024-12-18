const axios = require('axios');
const { getFFLogsToken } = require('./authFFLogsV2');

async function fetchCharacterDataV2(name, serverSlug, serverRegion) {
    const accessToken = await getFFLogsToken();

    const query = `
    query($name: String, $serverSlug: String, $serverRegion: String) {
        characterData {
            character(name: $name, serverSlug: $serverSlug, serverRegion: $serverRegion) {
                canonicalID,
                name,
                lodestoneID,
                id,
                guildRank,
                guilds {
                    id,
                    name
                }
                bestHPSRankingsRaids: zoneRankings(
                    byBracket: true,
                    includePrivateLogs: true,
                    metric: hps
                )
                bestDPSRankingsRaids: zoneRankings(
                    byBracket: true,
                    includePrivateLogs: true,
                    metric: dps
                )
                bestHPSRankingsEX1: encounterRankings(
                    includePrivateLogs: true,
                    metric: hps,
                    encounterID: 1071
                )
                bestDPSRankingsEX1: encounterRankings(
                    includePrivateLogs: true,
                    metric: dps,
                    encounterID: 1071
                ) 
                bestHPSRankingsEX2: encounterRankings(
                    includePrivateLogs: true,
                    metric: hps,
                    encounterID: 1072
                )
                bestDPSRankingsEX2: encounterRankings(
                    includePrivateLogs: true,
                    metric: dps,
                    encounterID: 1072
                )
                bestHPSRankingsEX3: encounterRankings(
                    includePrivateLogs: true,
                    metric: hps,
                    encounterID: 1078
                )
                bestDPSRankingsEX3: encounterRankings(
                    includePrivateLogs: true,
                    metric: dps,
                    encounterID: 1078
                )        
            }
        }
    }
`;



    const variables = {
        name,
        serverSlug,
        serverRegion
    };

    const response = await axios.post(
        'https://www.fflogs.com/api/v2/client',
        { query, variables },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
}

async function updateData(id) {
    const accessToken = await getFFLogsToken();

    const query = `
    query($id: Int!) {
        characterData {
            character(id: $id) {
                canonicalID
                name
                lodestoneID
                id
                guildRank
                guilds {
                    id
                    name
                }
                bestHPSRankingsRaids: zoneRankings(
                    byBracket: true,
                    includePrivateLogs: true,
                    metric: hps
                )
                bestDPSRankingsRaids: zoneRankings(
                    byBracket: true,
                    includePrivateLogs: true,
                    metric: dps
                )
                bestHPSRankingsEX1: encounterRankings(
                    includePrivateLogs: true,
                    metric: hps,
                    encounterID: 1071
                )
                bestDPSRankingsEX1: encounterRankings(
                    includePrivateLogs: true,
                    metric: dps,
                    encounterID: 1071
                )
                bestHPSRankingsEX2: encounterRankings(
                    includePrivateLogs: true,
                    metric: hps,
                    encounterID: 1072
                )
                bestDPSRankingsEX2: encounterRankings(
                    includePrivateLogs: true,
                    metric: dps,
                    encounterID: 1072
                )
                bestHPSRankingsEX3: encounterRankings(
                    includePrivateLogs: true,
                    metric: hps,
                    encounterID: 1078
                )
                bestDPSRankingsEX3: encounterRankings(
                    includePrivateLogs: true,
                    metric: dps,
                    encounterID: 1078
                )        
            }
        }
    }
`;
const variables = {
    id: parseInt(id),
};

const response = await axios.post(
    'https://www.fflogs.com/api/v2/client',
    { query, variables },
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    }
);

return response.data;
}

module.exports = { fetchCharacterDataV2, updateData };
