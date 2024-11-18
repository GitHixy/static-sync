import React, { useState, useEffect } from "react";
import Clipboard from "@react-native-clipboard/clipboard";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  createStatic,
  fetchStatics,
  deleteStatic,
  addExistingStatic
} from "../services/staticService";

const ManageStaticScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statics, setStatics] = useState([]);
  const [staticId, setStaticId] = useState('');
  const [copied, setCopied] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    loadStatics();
  }, []);

  const loadStatics = async () => {
    setIsLoading(true);
    try {
      const fetchedStatics = await fetchStatics();
      setStatics(fetchedStatics);
    } catch (error) {
      console.error("Error fetching statics:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStatic = async () => {
    if (!name) {
      alert("Please enter a name for your static.");
      return;
    }

    setIsLoading(true);
    try {
      await createStatic(name, description);
      setName("");
      setDescription("");
      await loadStatics();
      alert("Static created successfully!");
    } catch (error) {
      console.error("Error creating static:", error.message);
      alert("Failed to create static.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddStatic = async () => {
    if (!staticId) {
      alert("Please enter a Static ID");
      return;
    }
  
    try {
      const response = await addExistingStatic(staticId); 
      alert("Static added successfully!");
      setStaticId('')
      await loadStatics();
    } catch (error) {
      console.error("Failed to add static:", error);
      alert("Failed to add static. Please try again.");
    }
  };
  
  const confirmDeleteStatic = async (staticItem) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the static "${staticItem.name}"?`
    );

    if (userConfirmed) {
      try {
        await deleteStatic(staticItem._id);
        await loadStatics(); 
        alert("Static deleted successfully!");
      } catch (error) {
        if (error.message === 'You are not the owner of this static and cannot delete it.') {
          alert('You do not have permission to delete this static. Only the owner can delete it.');
        } else {
          alert('Failed to delete static. Please try again.');
        }
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/HomeBG.webp")}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
          <Text style={styles.title}>Create a Static</Text>
          <TextInput
            style={styles.input}
            placeholder="Static Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description (optional)"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateStatic}
          >
            <Text style={styles.createButtonText}>Create</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Add an Existing Static</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Static ID"
            placeholderTextColor="#888"
            value={staticId}
            onChangeText={setStaticId}
          />
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleAddStatic}
          >
            <Text style={styles.createButtonText}>Add Static</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size={50} color="#fff" style={styles.spinner} />
        ) : (
          <View style={styles.staticList}>
            <Text style={styles.sectionTitle}>Your Statics</Text>
            <FlatList
              data={statics}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => confirmDeleteStatic(item)}
                    >
                      <Text style={styles.deleteButtonText}>X</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.cardDescription}>
                    {item.description || "No description provided."}
                  </Text>
                  <Text style={styles.cardDetails}>
                    Members: {item.members.length} / 8 |{" Roster is "}
                    {item.isValidComposition ? "Complete" : "Incomplete"}
                  </Text>
                  <Text style={styles.cardDetails}>
                    Static ID: {item._id}
                    <TouchableOpacity
                      onPress={() => {
                        Clipboard.setString(item._id);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 4000);
                      }}
                    >
                      <Text style={styles.copyButton}>
                        {copied ? "Copied!" : "Copy ID"}
                      </Text>
                    </TouchableOpacity>
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => {
                      navigation.navigate("Static Details", {
                        staticId: item._id,
                      });
                    }}
                  >
                    <Text style={styles.detailsButtonText}>Roster Details</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
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
    padding: 10,
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  form: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  copyButton: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "bold",
    marginLeft: 5,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "uppercase",
  },
  spinner: {
    marginTop: 20,
  },
  staticList: {
    width: "90%",
  },
  sectionTitle: {
    fontSize: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 15,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 15,
  },
  cardDetails: {
    fontSize: 14,
    color: "#bbb",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderRadius: 15,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  detailsButton: {
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});

export default ManageStaticScreen;
