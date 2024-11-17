import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native';
import { fetchNews } from '../services/newsService';

const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true);
        const newsData = await fetchNews();

        const filteredNews = newsData.filter(item => item.category === 'topics' && item.image);
        setNews(filteredNews);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setIsLoading(false); 
      }
    };

    loadNews();
  }, []);

  const renderNewsItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.newsImage} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        <TouchableOpacity style={styles.readMore} onPress={() => Linking.openURL(item.url)}  >
          <Text style={styles.readMoreText}>Read more</Text>
        </TouchableOpacity>
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
    padding: 40,
  },
  listContainer: {
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9, 
    backgroundColor: '#ddd',
  },
  newsImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', 
  },
  textContainer: {
    padding: 15,
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
  readMore: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewsScreen;



