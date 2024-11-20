import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
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
          .slice(0, 16);

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
      <Text style={styles.time}>Scheduled for: {new Date(item.time).toLocaleString()}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => Linking.openURL(item.url)} style={styles.detailButton}>
          <Text style={styles.detailButtonText}>View Details</Text>
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
          data={maintenance}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMaintenanceItem}
          contentContainerStyle={styles.listContainer}
          numColumns={2} 
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
    padding: 20,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    display: 'flex',
    justifyContent: 'space-between', 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  time: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    flexGrow: 1, 
  },
  buttonContainer: {
    alignSelf: 'flex-start',
  },
  detailButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MaintenanceScreen;



