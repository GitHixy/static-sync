import React, { useState, useEffect, act } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Linking
} from 'react-native';
import {
  fetchActPlugins,
  fetchActOverlays,
  fetchDalamudPlugins,
  fetchDalamudRepos,
} from '../services/pluginsService';

const ITEMS_PER_PAGE = 20;

const PluginsScreen = () => {
  const [activeSection, setActiveSection] = useState('actPlugins');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (section) => {
    try {
      setIsLoading(true);
      setData([]);
      setSearchTerm(''); 
      setCurrentPage(1); 
      let fetchedData = [];

      switch (section) {
        case 'actPlugins':
          fetchedData = await fetchActPlugins();
          break;
        case 'actOverlays':
          fetchedData = await fetchActOverlays();
          break;
        case 'dalamudPlugins':
          fetchedData = await fetchDalamudPlugins();
          break;
        case 'dalamudRepos':
          fetchedData = await fetchDalamudRepos();
          break;
        default:
          break;
      }

      setData(fetchedData);
      setFilteredData(fetchedData);
    } catch (error) {
      console.error(`Error fetching ${section} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeSection);
  }, [activeSection]);

  useEffect(() => {
    // Filtra i risultati in base al termine di ricerca
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset alla prima pagina quando si filtra
  }, [searchTerm]);

  const getCurrentPageData = () => {
    if (activeSection === 'dalamudPlugins' || activeSection === 'dalamudRepos') {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return filteredData.slice(startIndex, endIndex);
    }
    return filteredData;
  };

  const renderPluginCard = ({ item }) => (
    <View style={styles.card}>
      {activeSection === "dalamudPlugins" && (
        <Text style={[styles.isFork, item.isFork ? styles.forked : styles.original]}>
          {item.isFork ? "Forked" : "Original"}
        </Text>
      )}
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.owner}>By: {item.owner}</Text>
      <TouchableOpacity
        onPress={() =>
          item.gitRepoUrl
            ? Linking.openURL(item.gitRepoUrl)
            : Linking.openURL(item.overlayUrl || item.pluginMasterUrl)
        }
        style={styles.detailButton}
      >
        
        <Text style={styles.detailButtonText}><FontAwesome name="github" size={16} color="#fff" style={{ marginRight: 6 }} />View on GitHub</Text>
      </TouchableOpacity>
    </View>
  );

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage * ITEMS_PER_PAGE < filteredData.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <ImageBackground source={require('../../assets/HomeBG.webp')} style={styles.background}>
      {/* Header con bottoni */}
      <View style={styles.header}>
        {['actPlugins', 'actOverlays', 'dalamudPlugins', 'dalamudRepos'].map((section) => (
          <TouchableOpacity
            key={section}
            style={[
              styles.headerButton,
              activeSection === section && styles.activeButton,
            ]}
            onPress={() => setActiveSection(section)}
          >
            <Text style={styles.headerButtonText}>
              {section
                .replace('act', 'ACT ')
                .replace('dalamud', 'Dalamud ')
                .replace(/([A-Z])/g, ' $1')
                .trim()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Barra di ricerca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search plugins..."
          placeholderTextColor="#aaa"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Spinner o lista di risultati */}
      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={50} color="#fff" />
        </View>
      ) : (
        <>
          <FlatList
            data={getCurrentPageData()}
            keyExtractor={(item) => item.id}
            renderItem={renderPluginCard}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
          />
          {(activeSection === 'dalamudPlugins' || activeSection === 'dalamudRepos') && (
            <View style={styles.paginationContainer}>
              <TouchableOpacity
                style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                onPress={() => handlePageChange('prev')}
                disabled={currentPage === 1}
              >
                <Text style={styles.pageButtonText}>Previous</Text>
              </TouchableOpacity>
              <Text style={styles.pageNumber}>Page {currentPage}</Text>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  currentPage * ITEMS_PER_PAGE >= filteredData.length && styles.disabledButton,
                ]}
                onPress={() => handlePageChange('next')}
                disabled={currentPage * ITEMS_PER_PAGE >= filteredData.length}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
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
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 10,
    zIndex: 10,
  
  },
  headerButton: {
    width: 150,
    textAlign: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#444',
    margin: 5,
  },
  activeButton: {
    backgroundColor: '#007bff',
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  searchContainer: {
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 10,
    zIndex: 2,
  },
  searchInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 5,
    padding: 8,
    fontSize: 16,
    zIndex: 2,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    display: 'flex',
    marginTop: 160,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  owner: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 10,
  },
  detailButton: {
   
    backgroundColor: '#000',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    textAlign: 'center',
    marginBottom: 30,
  },
  pageButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  pageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 10,
    paddingTop: 40,
    margin: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 15,
    position: 'relative',
    height: 160,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  isFork: {
    position: 'absolute',
    top: 13,
    right: 13,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    textAlign: 'center',
  },
  forked: {
    backgroundColor: '#ff4500',
    
  },
  original: {
    backgroundColor: '#32cd32',
    
  },
});

export default PluginsScreen;


