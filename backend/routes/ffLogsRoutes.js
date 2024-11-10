const express = require('express');
const { fetchCharacterDataV2 } = require('../utils/ffLogsV2');
const {fetchCharacterParsesV1} = require('../utils/ffLogsV1');
const router = express.Router();

// Funzione che trova un personaggio e parse in base a nome, server, regione
router.get('/character/:name/:serverSlug/:serverRegion', async (req, res) => {
    try {
        const { name, serverSlug, serverRegion } = req.params;

        console.log('Fetching character data from FF Logs API v2...');
        const characterData = await fetchCharacterDataV2(name, serverSlug, serverRegion);

        console.log('Fetching character parses from FF Logs API v1...');
        const characterParses = await fetchCharacterParsesV1(name, serverSlug, serverRegion);
        
        // Ordina e filtra i parse per includere i campi aggiuntivi
        const filteredParses = characterParses.reverse().map(parse => ({
            encounterID: parse.encounterID,
            encounterName: parse.encounterName,
            spec: parse.spec,
            rank: parse.rank,
            percentile: parse.percentile,
            total: parse.total,
            startTime: parse.startTime,
        }));

        // Filtra `characterInfo` mantenendo solo i campi essenziali con quelli aggiuntivi
        const simplifiedCharacterData = {
            id: characterData.data.characterData.character.canonicalID,
            name: characterData.data.characterData.character.name,
            lodestoneID: characterData.data.characterData.character.lodestoneID,
            guilds: characterData.data.characterData.character.guilds.map(guild => ({
                id: guild.id,
                name: guild.name
            })),
            bestHPSRankings: characterData.data.characterData.character.bestHPSRankings
                ? {
                    bestPerformanceAverage: characterData.data.characterData.character.bestHPSRankings.bestPerformanceAverage,
                    rankings: characterData.data.characterData.character.bestHPSRankings.rankings.map(ranking => ({
                        encounterID: ranking.encounter.id,
                        encounterName: ranking.encounter.name,
                        rank: ranking.rank,
                        rankPercent: ranking.rankPercent,
                        serverRank: ranking.allStars.serverRank,
                        regionRank: ranking.allStars.regionRank,
                        totalKills: ranking.totalKills,
                        bestAmount: ranking.bestAmount,
                        spec: ranking.spec
                    }))
                }
                : null,
            bestDPSRankings: characterData.data.characterData.character.bestDPSRankings
                ? {
                    bestPerformanceAverage: characterData.data.characterData.character.bestDPSRankings.bestPerformanceAverage,
                    rankings: characterData.data.characterData.character.bestDPSRankings.rankings.map(ranking => ({
                        encounterID: ranking.encounter.id,
                        encounterName: ranking.encounter.name,
                        rank: ranking.rank,
                        rankPercent: ranking.rankPercent,
                        serverRank: ranking.allStars.serverRank,
                        regionRank: ranking.allStars.regionRank,
                        totalKills: ranking.totalKills,
                        bestAmount: ranking.bestAmount,
                        spec: ranking.spec
                    }))
                }
                : null
        };

        const combinedData = {
            characterInfo: simplifiedCharacterData,
            RecentParses: filteredParses
        };

        res.json(combinedData);

    } catch (error) {
        console.error('Error fetching character data:', error.message);
        res.status(500).json({ message: 'Failed to fetch character data' });
    }
});

module.exports = router;

