import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Alert,
  Linking,
  Modal,
} from "react-native";
import { fetchCharacterData } from "../services/characterService";
import { fetchStatics, addMemberToStatic } from '../services/staticService';

const SearchPlayerScreen = () => {
  const [name, setName] = useState("");
  const [serverSlug, setServerSlug] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("EU");
  const [characterData, setCharacterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [role, setRole] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [statics, setStatics] = useState([]);
  const [selectedStatic, setSelectedStatic] = useState("");

  const formatNumber = (number) => {
    if (typeof number !== "number" || isNaN(number)) {
      return "N/A"; 
    }
  
    if (number >= 1000) {
      return (number / 1000).toFixed(2) + "k";
    }
  
    return number.toFixed(2);
  };
  

  const handleSearch = async () => {
    setIsLoading(true);
    setCharacterData(null);
    try {
      const data = await fetchCharacterData(name, serverSlug, selectedRegion);
      if (!data) {
        Alert.alert(
          "Character Not Found",
          "Please check the name and server information and try again."
        );
      }
      setCharacterData(data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Character not found or API request failed. Please check the details and try again."
      );
      console.error("Error fetching character data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = async () => {
    try {
      const fetchedStatics = await fetchStatics(); 
      setStatics(fetchedStatics);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching statics:", error.message);
      Alert.alert("Error", "Failed to fetch statics.");
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);

    if (newRole === "Tank") {
      setClassOptions(["Warrior", "Paladin", "Gunbreaker", "Dark Knight"]);
    } else if (newRole === "Healer") {
      setClassOptions(["White Mage", "Astrologian", "Sage", "Scholar"]);
    } else if (newRole === "DPS") {
      setClassOptions([
        "Melee DPS",
        "Physical Ranged DPS",
        "Magical Ranged DPS",
      ]);
    } else {
      setClassOptions([]);
    }
  };

  const handleClassChange = (newClass) => {
    if (newClass === "Melee DPS") {
      setClassOptions([
        "Monk",
        "Dragoon",
        "Ninja",
        "Samurai",
        "Reaper",
        "Viper",
      ]);
    } else if (newClass === "Physical Ranged DPS") {
      setClassOptions(["Bard", "Machinist", "Dancer"]);
    } else if (newClass === "Magical Ranged DPS") {
      setClassOptions(["Black Mage", "Summoner", "Red Mage", "Pictomancer"]);
    } else {
      setSelectedClass(newClass);
    }
  };

  const handleAddMember = async () => {
    if (!selectedStatic || !role || !selectedClass) {
      Alert.alert("Error", "Please select a role, class, and static.");
      return;
    }

    try {
      await addMemberToStatic(selectedStatic, {
        playerId: characterData.characterInfo.id,
        name: characterData.characterInfo.name,
        lodestoneID: characterData.characterInfo.lodestoneID,
        role,
        class: selectedClass,
        data: characterData.characterInfo, 
      });

      Alert.alert("Success", "Player added to the static!");
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding member to static:", error.message);
      Alert.alert("Error", "Failed to add player to static.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/HomeBG.webp")}
      style={styles.background}
    >
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
            {["EU", "NA", "JP", "OC", "CN"].map((region) => (
              <TouchableOpacity
                key={region}
                style={styles.regionOption}
                onPress={() => setSelectedRegion(region)}
              >
                <Text
                  style={[
                    styles.regionText,
                    selectedRegion === region && styles.selectedRegionText,
                  ]}
                >
                  {region}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.disclaimer}>
            Note: Korean (KR) logs and profiles are private and cannot be
            accessed.
          </Text>

          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size={50} color="#fff" style={styles.spinner} />
        ) : characterData ? (
          <View style={styles.results}>
            <Text style={styles.resultTitle}>
              {characterData.characterInfo.name}
            </Text>
            <Text
              style={styles.lodestoneLink}
              onPress={() =>
                Linking.openURL(
                  `https://na.finalfantasyxiv.com/lodestone/character/${characterData.characterInfo.lodestoneID}/`
                )
              }
            >
              View on Lodestone
            </Text>
            <Text style={styles.resultText}>
  Guild:{" "}
  {characterData.characterInfo.guilds && characterData.characterInfo.guilds.length > 0
    ? characterData.characterInfo.guilds.map((g) => g.name).join(", ")
    : "N/A"}
</Text>
<Text style={styles.resultText}>
  Guild Rank: {characterData.characterInfo.guildRank || "N/A"}
</Text>

            {/* Add Member Button */}
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Text style={styles.addButtonText}>
                Add this Player to a Static
              </Text>
            </TouchableOpacity>

            {/* Raids - DPS Rankings */}
            <Text style={styles.sectionTitle}>
              AAC Light-Heavyweight - DPS Rankings
            </Text>
            <View style={styles.cardContainer}>
              <Text style={styles.resultText2}>
                Best Performance Avg:{" "}
                {formatNumber(
                  characterData.characterInfo.Raids.bestDPSRankings
                    .bestPerformanceAverage
                )}
              </Text>
              {characterData.characterInfo.Raids.bestDPSRankings.rankings
                .slice(0, 4)
                .map((ranking, index) => (
                  <View key={index} style={styles.rankingContainer}>
                    <Text style={styles.rankText}>
                      {ranking.encounterName} - {ranking.spec}
                    </Text>
                    <Text style={styles.rankDetails}>
                    Rank Percent: {formatNumber(ranking.rankPercent)}
                    </Text>
                    <Text style={styles.rankDetails}>
                      Best Amount: {formatNumber(ranking.bestAmount)}
                    </Text>
                  </View>
                ))}
            </View>

            {/* Raids - HPS Rankings */}
            <Text style={styles.sectionTitle}>
              AAC Light-Heavyweight - HPS Rankings
            </Text>
            <View style={styles.cardContainer}>
              <Text style={styles.resultText2}>
                Best Performance Avg:{" "}
                {formatNumber(
                  characterData.characterInfo.Raids.bestHPSRankings
                    .bestPerformanceAverage
                )}
              </Text>
              {characterData.characterInfo.Raids.bestHPSRankings.rankings
                .slice(0, 4)
                .map((ranking, index) => (
                  <View key={index} style={styles.rankingContainer}>
                    <Text style={styles.rankText}>
                      {ranking.encounterName} - {ranking.spec}
                    </Text>
                    <Text style={styles.rankDetails}>
                    Rank Percent: {formatNumber(ranking.rankPercent)}
                    </Text>
                    <Text style={styles.rankDetails}>
                      Best Amount: {formatNumber(ranking.bestAmount)}
                    </Text>
                  </View>
                ))}
            </View>

            <View style={styles.divider} />

            {/* Trials - DPS and HPS Rankings for each boss */}
            {[
              "bestDPSRankingsEX1",
              "bestHPSRankingsEX1",
              "bestDPSRankingsEX2",
              "bestHPSRankingsEX2",
              "bestDPSRankingsEX3",
              "bestHPSRankingsEX3",
            ].map((key, index) => {
              const trial = characterData.characterInfo.Trials[key];
              if (trial && trial.ranks.length > 0) {
                const rankingType = key.includes("DPS") ? "DPS" : "HPS";
                return (
                  <View key={index} style={styles.cardContainer}>
                    <Text style={styles.sectionTitle2}>
                      {trial.encounterName} {rankingType} Rankings
                    </Text>
                    <Text style={styles.resultText2}>
                      Total Kills: {trial.totalKills}
                    </Text>
                    {trial.ranks.slice(0, 3).map((rank, rankIndex) => (
                      <View key={rankIndex} style={styles.rankDetailsContainer}>
                        <Text style={styles.rankText}>Spec: {rank.spec}</Text>
                        <Text style={styles.rankDetails}>
                          Rank Percent: {rank.rankPercent.toFixed(2)}%
                        </Text>
                        <Text style={styles.rankDetails}>
                          Amount: {formatNumber(rank.amount)}
                        </Text>
                        <Text style={styles.rankDetails}>
                          Total Parses: {rank.totalParses}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              }
              return null;
            })}
          </View>
        ) : null}

        {/* Modal for Adding Member */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Member to Static</Text>

              {/* Role Selection */}
              <Text style={styles.label2}>Select Role</Text>
              {["Tank", "Healer", "DPS"].map((item) => (
  <TouchableOpacity
    key={item}
    style={[
      styles.modalPicker,
      role === item && [
        item === "Tank" && styles.tankCard,
        item === "Healer" && styles.healerCard,
        item === "DPS" && styles.dpsCard,
      ],
    ]}
    onPress={() => handleRoleChange(item)}
  >
    <Text
      style={[
        styles.modalButtonText,
        role === item && { color: "#fff", fontWeight: "bold" },
      ]}
    >
      {item}
    </Text>
  </TouchableOpacity>
))}

              {/* Class Selection */}
              {role && (
  <>
    <Text style={styles.label2}>Select Class</Text>
    {classOptions.map((className) => (
      <TouchableOpacity
        key={className}
        style={[
          styles.modalPicker,
          selectedClass === className && {
            backgroundColor: "#007bff",
          },
        ]}
        onPress={() => handleClassChange(className)}
      >
        <Text
          style={[
            styles.modalButtonText,
            selectedClass === className && {
              color: "#fff",
              fontWeight: "bold",
            },
          ]}
        >
          {className}
        </Text>
      </TouchableOpacity>
    ))}
  </>
)}

              {/* Select Static */}
              <Text style={styles.label2}>Select Static</Text>
{statics.map((staticItem) => (
  <TouchableOpacity
    key={staticItem._id}
    style={[
      styles.modalPicker,
      selectedStatic === staticItem._id && {
        backgroundColor: "#28a745", // Verde per statico selezionato
      },
    ]}
    onPress={() => setSelectedStatic(staticItem._id)}
  >
    <Text
      style={[
        styles.modalButtonText,
        selectedStatic === staticItem._id && {
          color: "#fff",
          fontWeight: "bold",
        },
      ]}
    >
      {staticItem.name}
    </Text>
  </TouchableOpacity>
))}


              {/* Player Info */}
              {characterData && (
  <View style={{ marginTop: 15 }}>
    <Text style={styles.resultText}>
      Name: {characterData.characterInfo.name}
    </Text>
    <Text style={styles.resultText}>
      FF Logs ID: {characterData.characterInfo.id}
    </Text>
    <Text style={styles.resultText}>
      Lodestone ID: {characterData.characterInfo.lodestoneID}
    </Text>
  </View>
)}


              {/* Confirm and Cancel Buttons */}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddMember}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",

  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  label2: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    color: "#333",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  regionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  regionOption: {
    backgroundColor: "#555",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  regionText: {
    color: "#fff",
  },
  selectedRegionText: {
    fontWeight: "bold",
    color: "#ffdd00",
  },
  disclaimer: {
    fontSize: 12,
    color: "#fff",
    fontStyle: "italic",
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  spinner: {
    marginTop: 20,
  },
  results: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    width: "90%",
  },
  resultTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  lodestoneLink: {
    fontSize: 14,
    color: "#1e90ff",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 8,
  },
  resultText2: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    textAlign: "center",
  },
  sectionTitle2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  cardContainer: {
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    width: "100%",
  },
  tankCard: {
    backgroundColor: "#003366", // Blu per Tank
  },
  healerCard: {
    backgroundColor: "#2E8B57", // Verde per Healer
  },
  dpsCard: {
    backgroundColor: "#8B0000", // Rosso per DPS
  },
  rankingContainer: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffdd00",
  },
  rankDetailsContainer: {
    backgroundColor: "#444",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  rankDetails: {
    fontSize: 14,
    color: "#ddd",
  },
  divider: {
    height: 1,
    backgroundColor: "#888",
    marginVertical: 20,
    opacity: 0.6,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "90%",
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "rgba(0, 0, 0, 0.7)",
  },
  modalPicker: {
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalDropdown: {
    width: "100%",
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default SearchPlayerScreen;
