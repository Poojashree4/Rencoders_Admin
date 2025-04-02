

import React, { useState, useEffect } from 'react';
import { Pressable, Text, StyleSheet, View, SafeAreaView,TouchableOpacity, ScrollView, Alert, ImageBackground, Image, ToastAndroid } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../Navbar/Navbar.js';
import * as SecureStore from 'expo-secure-store';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);  
  const [loading, setLoading] = useState(true); 
  const profile = useNavigation();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("userPassword");
      console.log("Data removed");
      ToastAndroid.show("Logout Successful", ToastAndroid.SHORT);
      profile.replace("Login");  
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Logout failed. Please try again.");
    }
  };
  

  useEffect(() => {
    fetchProfile();
  }, []);

  
  const fetchProfile = async () => {
    try {
      const response = await fetch('http://192.168.1.5:4000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'pooja@gmail.com' }),  // Replace with actual email
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserProfile(data);  // Store the profile data
      setLoading(false);  // Stop loading
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
      setLoading(false);  // Stop loading even on error
    }
  };

 
  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No profile data found</Text>
      </SafeAreaView>
    );
  }
  

  return (
    <><ScrollView>

      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/474x/0f/f2/de/0ff2de5d50706ff975753350c8c18e1a.jpg' }} // Background image
        style={styles.backgroundImage}
      >
        <SafeAreaView style={styles.container}>

        
          <View style={styles.header}>
          <Text style={styles.name}>PROFILE</Text>
            {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => profile.goBack()}>
        <FontAwesome name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
            <Text style={styles.iconset} onPress={()=>profile.navigate('notification')}><Ionicons name="settings" size={24} color="white" /></Text>
            <Image
              source={{ uri: 'https://img.freepik.com/premium-photo/girl-happy-portrait-user-profile-by-ai_1119669-10.jpg' }} // Profile image
              style={styles.profileImage} />
            <Text style={styles.name}><FontAwesome name="user" size={24} color="white" />  {userProfile.name}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.profileItem}>📧 Email: {userProfile.email}</Text>
            <Text style={styles.profileItem}><FontAwesome6 name="phone" size={24} color="wheat" /> Phone: {userProfile.phoneNumber}</Text>
            <Text style={styles.profileItem}>💼 Experience: {userProfile.experience}</Text>
            <Text style={styles.profileItem}>📍 Location: {userProfile.location}</Text>

            {/* <Pressable style={styles.editButton} onPress={() => Alert.alert('Edit Profile')}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </Pressable> */}
            <Pressable style={styles.editButton} onPress={() => profile.navigate('editprofile', { userEmail: userProfile.email })}>
  <Text style={styles.buttonText}>Edit Profile</Text>
</Pressable>

            <Pressable style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>

          </View>
        </SafeAreaView>
      </ImageBackground>
    </ScrollView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',  // Ensures background image covers the entire screen
    justifyContent: 'center',
    height: '150%',       // Ensure it covers the entire container's height
    width: '100%',        // Ensure it covers the entire container's width
},
backButton: {
  position: "absolute",
  top: 15,
  left: 15,
  zIndex: 1,
},

  header: {
    padding: 40,
    alignItems: 'center',
    marginTop: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,  // Makes the image round
    borderWidth: 3,
    borderColor: '#fff',  // White border around the profile image
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  profileCard: {
    backgroundColor: 'rgba(133, 133, 190, 0.4)',  // Light purple with 70% opacity
    padding: 30,
    margin: 20,
    height: 430,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: -20,
    
},

profileItem: {
    fontSize: 20,
    color: 'white',
    marginBottom: 15,
    // textAlign: 'center', 
    padding: 5,
},

editButton: {
    backgroundColor: '#4169e1',
    paddingVertical: 12,  // Reduced vertical padding
    paddingHorizontal: 8,  // Reduced horizontal padding
    borderRadius: 10,  // Adjusted to keep the circular shape smaller
    marginVertical: 5,  // Reduced vertical margin
    alignItems: 'center',
    width: 220,  // Explicitly set a smaller width
    marginLeft:40,
    marginTop:22,
  },


  logoutButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: 220,
    marginLeft:40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  iconset:{
   
    marginLeft:'93%',
    marginBottom:20,
    marginTop:-20,
  }
});
