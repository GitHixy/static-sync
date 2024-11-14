import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ImageBackground, ScrollView, Alert, Linking } from 'react-native';
import { fetchCharacterData } from '../services/characterService';

const SearchPlayerScreen = () => {
  const [name, setName] = useState('');
  const [serverSlug, setServerSlug] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('EU');
  const [characterData, setCharacterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (number) => {
    if (number >= 1000) {
      return (number / 1000).toFixed(2) + 'k';
    }
    return number.toFixed(2);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setCharacterData(null);
    try {
      const data = await fetchCharacterData(name, serverSlug, selectedRegion);
      if (!data) {
        Alert.alert('Character Not Found', 'Please check the name and server information and try again.');
      }
      setCharacterData(data);
    } catch (error) {
      Alert.alert("Error", "Character not found or API request failed. Please check the details and try again.");
      console.error("Error fetching character data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../../assets/HomeBG.webp')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.label}>Character Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter character name"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Server</Text>
          <TextInput
            style={styles.input}
            value={serverSlug}
            onChangeText={setServerSlug}
            placeholder="Enter server"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Server Region</Text>
          <View style={styles.regionContainer}>
            {['EU', 'NA', 'JP', 'OC', 'CN'].map((region) => (
              <TouchableOpacity key={region} style={styles.regionOption} onPress={() => setSelectedRegion(region)}>
                <Text style={[styles.regionText, selectedRegion === region && styles.selectedRegionText]}>
                  {region}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.disclaimer}>
            Note: Korean (KR) logs and profiles are private and cannot be accessed.
          </Text>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.spinner} />
        ) : characterData ? (
          <View style={styles.results}>
            <Text style={styles.resultTitle}>{characterData.characterInfo.name}</Text>
            <Text
              style={styles.lodestoneLink}
              onPress={() => Linking.openURL(`https://na.finalfantasyxiv.com/lodestone/character/${characterData.characterInfo.lodestoneID}/`)}
            >
              View on Lodestone
            </Text>
            <Text style={styles.resultText}>Guild: {characterData.characterInfo.guilds.map(g => g.name).join(', ')}</Text>
            <Text style={styles.resultText}>Guild Rank: {characterData.characterInfo.guildRank}</Text>
            
            {/* Raids - DPS Rankings */}
            <Text style={styles.sectionTitle}>AAC Light-Heavyweight - DPS Rankings</Text>
            <View style={styles.cardContainer}>
              <Text style={styles.resultText2}>Best Performance Avg: {formatNumber(characterData.characterInfo.Raids.bestDPSRankings.bestPerformanceAverage)}</Text>
              {characterData.characterInfo.Raids.bestDPSRankings.rankings.slice(0, 4).map((ranking, index) => (
                <View key={index} style={styles.rankingContainer}>
                  <Text style={styles.rankText}>{ranking.encounterName} - {ranking.spec}</Text>
                  <Text style={styles.rankDetails}>Rank Percent: {ranking.rankPercent.toFixed(2)}%</Text>
                  <Text style={styles.rankDetails}>Best Amount: {formatNumber(ranking.bestAmount)}</Text>
                </View>
              ))}
            </View>

            {/* Raids - HPS Rankings */}
            <Text style={styles.sectionTitle}>AAC Light-Heavyweight - HPS Rankings</Text>
            <View style={styles.cardContainer}>
              <Text style={styles.resultText2}>Best Performance Avg: {formatNumber(characterData.characterInfo.Raids.bestHPSRankings.bestPerformanceAverage)}</Text>
              {characterData.characterInfo.Raids.bestHPSRankings.rankings.slice(0, 4).map((ranking, index) => (
                <View key={index} style={styles.rankingContainer}>
                  <Text style={styles.rankText}>{ranking.encounterName} - {ranking.spec}</Text>
                  <Text style={styles.rankDetails}>Rank Percent: {ranking.rankPercent.toFixed(2)}%</Text>
                  <Text style={styles.rankDetails}>Best Amount: {formatNumber(ranking.bestAmount)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            {/* Trials - DPS and HPS Rankings for each boss */}
            {['bestDPSRankingsEX1', 'bestHPSRankingsEX1', 'bestDPSRankingsEX2', 'bestHPSRankingsEX2', 'bestDPSRankingsEX3', 'bestHPSRankingsEX3'].map((key, index) => {
  const trial = characterData.characterInfo.Trials[key];
  if (trial && trial.ranks.length > 0) {
    const rankingType = key.includes('DPS') ? 'DPS' : 'HPS'; 
    return (
      <View key={index} style={styles.cardContainer}>
        <Text style={styles.sectionTitle2}>{trial.encounterName} {rankingType} Rankings</Text>
        <Text style={styles.resultText2}>Total Kills: {trial.totalKills}</Text>
        {trial.ranks.slice(0, 3).map((rank, rankIndex) => (
          <View key={rankIndex} style={styles.rankDetailsContainer}>
            <Text style={styles.rankText}>Spec: {rank.spec}</Text>
            <Text style={styles.rankDetails}>Rank Percent: {rank.rankPercent.toFixed(2)}%</Text>
            <Text style={styles.rankDetails}>Amount: {formatNumber(rank.amount)}</Text>
            <Text style={styles.rankDetails}>Total Parses: {rank.totalParses}</Text>
          </View>
        ))}
      </View>
    );
  }
  return null;
})}
          </View>
        ) : null}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    padding: 10,
  },
  scrollContainer: {
    paddingTop: 20,
    alignItems: 'center',
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#333',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  regionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  regionOption: {
    backgroundColor: '#555',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  regionText: {
    color: '#fff',
  },
  selectedRegionText: {
    fontWeight: 'bold',
    color: '#ffdd00',
  },
  disclaimer: {
    fontSize: 12,
    color: '#fff',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spinner: {
    marginTop: 20,
  },
  results: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: '90%',
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  lodestoneLink: {
    fontSize: 14,
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 8,
  },
  resultText2: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    width: '100%',
  },
  rankingContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffdd00',
  },
  rankDetailsContainer: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  rankDetails: {
    fontSize: 14,
    color: '#ddd',
  },
  divider: {
    height: 1,
    backgroundColor: '#888',
    marginVertical: 20,
    opacity: 0.6,
}
});

export default SearchPlayerScreen;
