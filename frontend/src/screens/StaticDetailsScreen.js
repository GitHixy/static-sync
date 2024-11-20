import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Platform
} from 'react-native';
import { fetchStaticById, updateStaticMembers } from '../services/staticService';

const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return 'N/A';
  }

  if (number >= 1000) {
    return (number / 1000).toFixed(2) + 'k';
  }

  return number.toFixed(2);
};

const StaticDetailsScreen = ({ route }) => {
  const { staticId } = route.params || {};
  const [staticDetails, setStaticDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadStaticDetails = async () => {
      try {
        const details = await fetchStaticById(staticId);
       
        setStaticDetails(details);
      } catch (error) {
        console.error('Error fetching static details:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaticDetails();
  }, [staticId]);

  const handleUpdateData = async () => {
const now = new Date();
if (lastUpdated && now - lastUpdated < 15 * 60 * 1000) {
   window.alert(
      'You can update data only once every 15 minutes.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const updatedData = await updateStaticMembers(staticId);
      setStaticDetails(updatedData.staticData);
      setLastUpdated(new Date());
      window.alert('Static members updated successfully!');
    } catch (error) {
      console.error('Error updating static members:', error.message);
      windows.alert('Failed to update static members.');
    } finally {
      setIsLoading(false);
    }
  };

  const getBackgroundColor = (role) => {
    switch (role) {
      case 'Tank':
        return '#1e90ff';
      case 'Healer':
        return '#32cd32';
      case 'DPS':
        return '#ff4500';
      default:
        return '#ccc';
    }
  };

  const sortMembersByRole = (members) => {
    if (!Array.isArray(members)) {
      console.error('Members is not an array:', members);
      return [];
  }
    const roleOrder = { Tank: 1, Healer: 2, DPS: 3 };
    return [...members].sort((a, b) => {
      if (a.role !== b.role) {
        return roleOrder[a.role] - roleOrder[b.role];
      }
      return a.name.localeCompare(b.name);
    });
  };

  const extractRankingData = (members, type, category) => {
    
    const sortedMembers = sortMembersByRole(members);
    return sortedMembers.map((member) => {
      const rankings =
        member.data?.[category]?.[type]?.rankings || [];
        
      return {
        name: member.name,
        role: member.role,
        rankings,
      };
    });

  };

  const renderRankingTable = (rankingData) => {
    
    const allEncounters = [
      ...new Set(
        rankingData
          .flatMap((member) =>
            member.rankings.map((ranking) => ranking.encounter.name)
          )
      ),
    ];


    return (
      <ScrollView horizontal style={styles.scrollContainer}>
      <View style={styles.rankingsTable}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>Encounter</Text>
          {rankingData.map((member, index) => (
            <Text
              key={index}
              style={[
                styles.tableHeaderText,
                { backgroundColor: getBackgroundColor(member.role) },
              ]}
            >
              {member.name}
            </Text>
          ))}
          <Text style={styles.tableHeaderText}>Total</Text>
        </View>
        {allEncounters.map((encounter, index) => {
          const amounts = rankingData.map((member) => {
            const ranking = member.rankings.find(
              (r) => r.encounter.name === encounter
            );
            return ranking?.bestAmount || 0;
          });

          const totalForEncounter = amounts.reduce(
            (total, amount) => total + amount,
            0
          );

          const maxAmount = Math.max(...amounts);

          return (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{encounter}</Text>
              {amounts.map((amount, memberIndex) => (
                <Text
                  key={memberIndex}
                  style={[
                    styles.tableCell,
                    amount === maxAmount && styles.highlight,
                  ]}
                >
                  {amount > 0 ? formatNumber(amount) : 'N/A'}
                </Text>
              ))}
              <Text style={[styles.tableCell, styles.totalText]}>
                {formatNumber(totalForEncounter)}
              </Text>
            </View>
          );
        })}
      </View>
      </ScrollView>
    );
  }; 

  if (isLoading) {
    return (
      <ImageBackground
        source={require('../../assets/HomeBG.webp')}
        style={styles.background}
      >
        <ActivityIndicator size={50} color="#007bff" style={styles.loading} />
      </ImageBackground>
    );
  }

  const sortedMembers = sortMembersByRole(staticDetails.members);

  const dpsRaidRankingData = extractRankingData(
    sortedMembers,
    'bestDPSRankings',
    'Raids'
  );
  const hpsRaidRankingData = extractRankingData(
    sortedMembers,
    'bestHPSRankings',
    'Raids'
  );



  return (
    <ImageBackground
      source={require('../../assets/HomeBG.webp')}
      style={styles.background}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{staticDetails.name}</Text>
        <TouchableOpacity onPress={handleUpdateData}>
          <Text style={styles.updateText}>Update Data</Text>
        </TouchableOpacity>
        
      </View>
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          Description: {staticDetails.description || 'No description provided.'}
        </Text>

        <View style={styles.membersContainer}>
          {sortedMembers.map((member, index) => (
            <View
              key={index}
              style={[
                styles.memberCard,
                {
                  backgroundColor: getBackgroundColor(member.role),
                  marginRight: index % 2 === 0 ? 10 : 0,
                },
              ]}
            >
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>
                {member.role} - {member.class}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.rankingsTitle}>Raid DPS Rankings</Text>
        {renderRankingTable(dpsRaidRankingData)}

        <Text style={styles.rankingsTitle}>Raid HPS Rankings</Text>
        {renderRankingTable(hpsRaidRankingData)}

      </ScrollView>
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
  scrollContainer: {
    marginBottom: 20,
  },
  updateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  description: {
    fontSize: 22,
    marginBottom: 20,
    color: '#fff',
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  memberCard: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberRole: {
    fontSize: 16,
    color: '#ddd',
  },
  rankingsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff',
  },
  rankingsTable: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
    alignItems: 'center', 
    textAlign: 'center',
  },
  tableHeaderText: {
    paddingVertical: 10,
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    width: 100,
    overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    margin: 0,
  },
  tableCell: {
    paddingVertical: 5,
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: '#fff',
    width: 100,
    paddingHorizontal: 5,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#ffcc00',
  },
  totalText: {
    fontWeight: 'bold',
    color: '#ffcc00',
  },
});

export default StaticDetailsScreen;






