const express = require("express");
const NodeCache = require("node-cache");
const { fetchCharacterDataV2 } = require("../utils/ffLogsV2");
const { fetchCharacterParsesV1 } = require("../utils/ffLogsV1");
const router = express.Router();

const cache = new NodeCache({ stdTTL: 900 }); // TTL 15 Minuti

// Funzione che trova un personaggio e parse in base a nome, server, regione
router.get("/character/:name/:serverSlug/:serverRegion", async (req, res) => {
  const { name, serverSlug, serverRegion } = req.params;
  const cacheKey = `${name}-${serverSlug}-${serverRegion}`;

  // Controlla se i dati sono già in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Getting Data from Cache");
    return res.json(cachedData);
  }

  try {
    console.log("Fetching character data from FF Logs API v2...");
    const characterData = await fetchCharacterDataV2(
      name,
      serverSlug,
      serverRegion
    );

    console.log("Fetching character parses from FF Logs API v1...");
    const characterParses = await fetchCharacterParsesV1(
      name,
      serverSlug,
      serverRegion
    );

    // Ordina e filtra i parse per includere i campi aggiuntivi
    const filteredParses = characterParses.reverse().map((parse) => ({
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
      guildRank: characterData.data.characterData.character.guildRank,
      guilds: characterData.data.characterData.character.guilds.map(
        (guild) => ({
          id: guild.id,
          name: guild.name,
        })
      ),
      Raids: {
        bestHPSRankings: characterData.data.characterData.character
          .bestHPSRankingsRaids
          ? {
              bestPerformanceAverage:
                characterData.data.characterData.character.bestHPSRankingsRaids
                  .bestPerformanceAverage,
              rankings:
                characterData.data.characterData.character.bestHPSRankingsRaids.rankings.map(
                  (ranking) => ({
                    encounterID: ranking.encounter.id,
                    encounterName: ranking.encounter.name,
                    rank: ranking.rank,
                    rankPercent: ranking.rankPercent,
                    serverRank: ranking.allStars.serverRank,
                    regionRank: ranking.allStars.regionRank,
                    totalKills: ranking.totalKills,
                    bestAmount: ranking.bestAmount,
                    spec: ranking.spec,
                  })
                ),
            }
          : null,
        bestDPSRankings: characterData.data.characterData.character
          .bestDPSRankingsRaids
          ? {
              bestPerformanceAverage:
                characterData.data.characterData.character.bestDPSRankingsRaids
                  .bestPerformanceAverage,
              rankings:
                characterData.data.characterData.character.bestDPSRankingsRaids.rankings.map(
                  (ranking) => ({
                    encounterID: ranking.encounter.id,
                    encounterName: ranking.encounter.name,
                    rank: ranking.rank,
                    rankPercent: ranking.rankPercent,
                    serverRank: ranking.allStars.serverRank,
                    regionRank: ranking.allStars.regionRank,
                    totalKills: ranking.totalKills,
                    bestAmount: ranking.bestAmount,
                    spec: ranking.spec,
                  })
                ),
            }
          : null,
      },
      Trials: {
        bestHPSRankingsEX1: characterData.data.characterData.character
          .bestHPSRankingsEX1
          ? {
              encounterID: "1071",
              encounterName: "Valigarmanda",
              totalKills:
                characterData.data.characterData.character.bestHPSRankingsEX1
                  .totalKills,
              ranks:
                characterData.data.characterData.character.bestHPSRankingsEX1.ranks.map(
                  (rank) => ({
                    rankPercent: rank.rankPercent,
                    reportID: rank.report.code,
                    startTime: rank.startTime,
                    spec: rank.spec,
                    amount: rank.amount,
                    totalParses: rank.rankTotalParses,
                  })
                ),
            }
          : null,
        bestDPSRankingsEX1: characterData.data.characterData.character
          .bestDPSRankingsEX1
          ? {
              encounterID: "1071",
              encounterName: "Valigarmanda",
              totalKills:
                characterData.data.characterData.character.bestDPSRankingsEX1
                  .totalKills,
              ranks:
                characterData.data.characterData.character.bestDPSRankingsEX1.ranks.map(
                  (rank) => ({
                    rankPercent: rank.rankPercent,
                    reportID: rank.report.code,
                    startTime: rank.startTime,
                    spec: rank.spec,
                    amount: rank.amount,
                    totalParses: rank.rankTotalParses,
                  })
                ),
            }
          : null,
        bestHPSRankingsEX2: characterData.data.characterData.character
          .bestHPSRankingsEX2
          ? {
              encounterID: "1072",
              encounterName: "Zoraal Ja",
              totalKills:
                characterData.data.characterData.character.bestHPSRankingsEX2
                  .totalKills,
              ranks:
                characterData.data.characterData.character.bestHPSRankingsEX2.ranks.map(
                  (rank) => ({
                    rankPercent: rank.rankPercent,
                    reportID: rank.report.code,
                    startTime: rank.startTime,
                    spec: rank.spec,
                    amount: rank.amount,
                    totalParses: rank.rankTotalParses,
                  })
                ),
            }
          : null,
        bestDPSRankingsEX2: characterData.data.characterData.character
          .bestDPSRankingsEX2
          ? {
              encounterID: "1072",
              encounterName: "Zoraal Ja",
              totalKills:
                characterData.data.characterData.character.bestDPSRankingsEX2
                  .totalKills,
              ranks:
                characterData.data.characterData.character.bestDPSRankingsEX2.ranks.map(
                  (rank) => ({
                    rankPercent: rank.rankPercent,
                    reportID: rank.report.code,
                    startTime: rank.startTime,
                    spec: rank.spec,
                    amount: rank.amount,
                    totalParses: rank.rankTotalParses,
                  })
                ),
            }
          : null,
      },
    };

    const combinedData = {
      characterInfo: simplifiedCharacterData,
      RecentParses: filteredParses,
    };

    cache.set(cacheKey, combinedData);
    res.json(combinedData);
  } catch (error) {
    console.error("Error fetching character data:", error.message);
    res.status(500).json({ message: "Failed to fetch character data" });
  }
});

module.exports = router;
