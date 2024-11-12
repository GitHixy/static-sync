import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchMaintenance } from '../services/maintenanceService';

const MaintenanceScreen = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMaintenance = async () => {
      try {
        setIsLoading(true);
        const maintenanceData = await fetchMaintenance();

        
        const sortedMaintenance = maintenanceData
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 15);
        
        setMaintenance(sortedMaintenance);
      } catch (error) {
        console.error("Failed to fetch maintenance data", error);
      } finally {
        setIsLoading(false); 
      }
    };

    loadMaintenance();
  }, []);

  const renderMaintenanceItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>{new Date(item.time).toLocaleString()}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/HomeBG.webp')} style={styles.background}>
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <FlatList
          data={maintenance}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMaintenanceItem}
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
    padding: 10,
  },
  listContainer: {
    paddingTop: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MaintenanceScreen;


