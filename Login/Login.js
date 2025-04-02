

import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, TextInput, View, Image, ToastAndroid, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import styles from './Loginstyle.js';
import * as SecureStore from 'expo-secure-store'; 
import { LinearGradient } from 'expo-linear-gradient';

async function retrieveData() {
  try {
    const email = await SecureStore.getItemAsync('userEmail');
    const token = await SecureStore.getItemAsync('userToken');
    console.log('Stored Email:', email);
    console.log('Stored Token:', token);
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigation = useNavigation();

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const onSubmit = async () => {
    if (!validateEmail(email)) {
      ToastAndroid.show("Please enter a valid email address.", ToastAndroid.SHORT);
      return;
    }
    if (!validatePassword(password)) {
      ToastAndroid.show("Password must be at least 8 characters long.", ToastAndroid.SHORT);
      return;
    }

    try {
      const response = await fetch("http://192.168.1.5:4000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        ToastAndroid.show("Login successful!", ToastAndroid.SHORT);

        // Store user email or token 
        await SecureStore.setItemAsync('userEmail', email);
        await SecureStore.setItemAsync('userToken', data.token);  
        retrieveData();
    
        navigation.navigate('adminhome'); 
      } else {
        ToastAndroid.show(data.error || "Invalid credentials", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Login Failed, Try again later.", ToastAndroid.SHORT);
    }
  };
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#88d3ce', '#ebb8ff']} //  colors={['#6e45e2', '#88d3ce']}
        style={styles.gradientBackground}
      >
        <View style={styles.logoContainer}>
        <Image 
          source={{ uri: "https://renambl.blr1.cdn.digitaloceanspaces.com/rcoders/web/Rencoders_logo.png" }} 
          style={[styles.logo, { width: windowWidth * 0.6, height: windowHeight * 0.2 }]} 
        />
          <Text style={styles.appSubtitle}>
           Start Learning and Embrace New Skills for Better Future!!
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.box}>
        <Text style={styles.welcomeText}>Welcome Back</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inpt}
            placeholder='user@gmail.com'
            placeholderTextColor="#999"
            onChangeText={(text) => setEmail(text)}
            value={email}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inpt}
            placeholder='Password'
            placeholderTextColor="#999"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
          <Text style={styles.forgotPassword}>Forget password?</Text>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => (email && password) ? onSubmit() : ToastAndroid.show("Please enter Email and Password", ToastAndroid.SHORT)}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}



