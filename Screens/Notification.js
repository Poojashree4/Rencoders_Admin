import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

export default function Notification() {
  const [emailNotifications, setEmailNotification] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appUpdates, setAppUpdates] = useState(true);
  const [promotionalOffers, setPromotionalOffers] = useState(false);
  const [eventRemainders, setEventRemainders] = useState(true);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="#444" />
      </TouchableOpacity> */}

      {/* <Text style={styles.header}>Notification Settings</Text> */}

      {/* Notification Settings */}
      <View style={styles.notificationRow}>
        <Text style={styles.label}>Email Notifications</Text>
        <Switch value={emailNotifications} onValueChange={() => setEmailNotification(!emailNotifications)} />
      </View>

      <View style={styles.notificationRow}>
        <Text style={styles.label}>SMS Notifications</Text>
        <Switch value={smsNotifications} onValueChange={() => setSmsNotifications(!smsNotifications)} />
      </View>

      <View style={styles.notificationRow}>
        <Text style={styles.label}>App Updates</Text>
        <Switch value={appUpdates} onValueChange={() => setAppUpdates(!appUpdates)} />
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  notificationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
