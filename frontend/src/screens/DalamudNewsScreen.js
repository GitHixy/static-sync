import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

import { fetchDalamudNews } from '../services/discordService';

const DalamudNewsScreen = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const newsData = await fetchDalamudNews();
        setNews(newsData); 
      } catch (error) {
        console.error('Failed to fetch Dalamud news', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderNewsItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.author}</Text>
        <Text style={styles.description}>{item.content}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()} 
        </Text>
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/HomeBG.webp')} style={styles.background}>
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  listContainer: {
    padding: 40,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textContainer: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DalamudNewsScreen;
