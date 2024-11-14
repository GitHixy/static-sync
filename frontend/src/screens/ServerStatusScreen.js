import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchServerStatus } from '../services/serverStatusService';

const REFRESH_INTERVAL = 60;

const ServerStatusScreen = () => {
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(REFRESH_INTERVAL);

  const loadServerStatus = async () => {
    try {
      setLoading(true);
      const data = await fetchServerStatus();
      setStatusData(data);
    } catch (error) {
      console.error("Error loading server status:", error);
    } finally {
      setLoading(false);
      setRefreshTime(REFRESH_INTERVAL);
    }
  };

  useEffect(() => {
    loadServerStatus();
    const interval = setInterval(loadServerStatus, REFRESH_INTERVAL * 1000);
    const timerInterval = setInterval(() => {
      setRefreshTime(prev => (prev > 0 ? prev - 1 : REFRESH_INTERVAL));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, []);

  const renderServerItem = ({ item }) => (
    <View
      style={[
        styles.serverCard,
        { backgroundColor: item.status === 'Online' ? '#4CAF50' : '#F44336' }, 
      ]}
    >
      <Text style={styles.serverName}>{item.name}</Text>
      <Text style={styles.serverInfo}>Status: {item.status}</Text>
      <Text style={styles.serverInfo}>Congestion: {item.congestion || 'N/A'}</Text>
      <Text style={styles.serverInfo}>Creation: {item.creation || 'N/A'}</Text>
    </View>
  );

  const renderDataCenterItem = ({ item }) => (
    <View style={styles.dataCenterCard}>
      <Text style={styles.title}>{item.name} - {item.region}</Text>
      <Text style={styles.info}>Status: <Text style={item.status === 'Online' ? styles.statusOnline : styles.statusOffline}>{item.status}</Text></Text>
      <Text style={styles.info}>Latency: {item.latency} ms</Text>

      {/* Grid layout dei server */}
      <FlatList
        data={item.servers}
        keyExtractor={(server) => server.name}
        renderItem={renderServerItem}
        numColumns={2}
        columnWrapperStyle={styles.serverRow}
        contentContainerStyle={styles.serverListContainer}
      />
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/HomeBG.webp')} style={styles.background}>
      {loading ? (
        <ActivityIndicator size={50} color="#fff" style={styles.loader} />
      ) : (
        <View style={styles.content}>
          <Text style={styles.refreshText}>Refreshing in: {refreshTime}s</Text>
          <FlatList
            data={statusData}
            keyExtractor={(item) => item.name}
            renderItem={renderDataCenterItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  refreshText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  listContainer: {
    paddingTop: 20,
  },
  dataCenterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  statusOnline: {
    color: '#4CAF50', 
    fontWeight: 'bold',
  },
  statusOffline: {
    color: '#F44336', 
    fontWeight: 'bold',
  },
  serverListContainer: {
    paddingTop: 10,
  },
  serverRow: {
    justifyContent: 'space-between',
  },
  serverCard: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    flex: 1,
  },
  serverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  serverInfo: {
    fontSize: 12,
    color: '#ddd',
  },
});

export default ServerStatusScreen;


