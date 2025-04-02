

import React, { useState, useEffect, useRef } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import Navbar from '../Navbar/Navbar';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Picker } from '@react-native-picker/picker';

export default function Trainer() {
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [specificCourse, setSpecificCourse] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(''); // New state for course picker
  const [staffs, setStaffs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://192.168.1.5:4000/displaystaff', {
        method: 'POST',
      });
      const data = await response.json();
      setStaffs(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      Alert.alert('Error', 'Failed to load staff data');
    }
  };

  const addStaff = async () => {
    if (staffId && staffName && specificCourse) {
      try {
        const response = await fetch('http://192.168.1.5:4000/addstaff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staffId,
            staffName,
            specificCourse: specificCourse.split(',').map(course => course.trim()),
          }),
        });

        if (response.ok) {
          Alert.alert('Success', 'Staff added successfully');
          fetchStaff();
          setStaffId('');
          setStaffName('');
          setSpecificCourse('');
          setSelectedCourse('');
          setIsEditing(false);
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.error || 'Failed to add staff');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to add staff');
      }
    } else {
      Alert.alert('Validation Error', 'Please fill in all fields');
    }
  };

  const updateStaff = async () => {
    if (staffId && staffName && specificCourse) {
      try {
        const response = await fetch('http://192.168.1.5:4000/updatestaff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staffId,
            staffName,
            specificCourse: specificCourse.split(',').map(course => course.trim()),
          }),
        });

        if (response.ok) {
          Alert.alert('Success', 'Staff updated successfully');
          fetchStaff();
          setStaffId('');
          setStaffName('');
          setSpecificCourse('');
          setSelectedCourse('');
          setIsEditing(false);
        } else {
          const errorData = await response.json();
          Alert.alert('Error', errorData.error || 'Failed to update staff');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to update staff');
      }
    } else {
      Alert.alert('Validation Error', 'Please fill in all fields');
    }
  };

  const editStaff = (staff) => {
    setStaffId(staff.staffId);
    setStaffName(staff.staffName);
    setSpecificCourse(staff.specificCourse.join(', '));
    setIsEditing(true);
    
    // Scroll to top of the form
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      <ScrollView 
        style={styles.scrollView}
        ref={scrollViewRef}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trainer Management</Text>
            <Text style={styles.headerSubtitle}>Manage your training staff</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{isEditing ? '✏️ Edit Trainer' : ' Add New Trainer'}</Text>
            <Text style={styles.inputLabel}>Trainer ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trainer ID"
              value={staffId}
              onChangeText={setStaffId}
              editable={!isEditing}
            />
            <Text style={styles.inputLabel}>Trainer Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter trainer name"
              value={staffName}
              onChangeText={setStaffName}
            />
            
            <Text style={styles.inputLabel}>Course Name</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCourse}
                onValueChange={(itemValue) => {
                  setSelectedCourse(itemValue);
                  // Add selected course to the comma-separated list
                  setSpecificCourse(prev => 
                    prev ? `${prev}, ${itemValue}` : itemValue
                  );
                }}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Select Course" value="" />
                <Picker.Item label="Mern Stack" value="Mern Stack" />
                <Picker.Item label="Java Full Stack" value="Java Full Stack" />
                <Picker.Item label="Python Full Stack" value="Python Full Stack" />
                <Picker.Item label="Data Structures" value="Data Structures" />
                <Picker.Item label="React Advanced" value="React Advanced" />
              </Picker>
            </View>

            <Text style={styles.inputLabel}>Assigned Courses (comma-separated)</Text>
            <TextInput
              style={styles.input}
              placeholder="Comma-separated course list"
              value={specificCourse}
              onChangeText={setSpecificCourse}
            />
            
            <Pressable 
              style={[styles.button, isEditing ? styles.updateButton : styles.addButton]} 
              onPress={isEditing ? updateStaff : addStaff}
            >
              <Text style={styles.buttonText}>
                {isEditing ? ' Update Trainer' : ' Add Trainer'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}> Trainer List</Text>

          {staffs.length === 0 ? (
            <Text style={styles.emptyMessage}>No trainers added yet</Text>
          ) : (
            staffs.map((staff) => (
              <TouchableOpacity
                key={staff.staffId}
                style={styles.staffCard}
                onPress={() => navigation.navigate('trainerlist', { staff })}
              >
                <View style={styles.staffInfo}>
                  <View>
                    <Text style={styles.staffName}>👤 {staff.staffName}</Text>
                    <Text style={styles.staffDetail}> ID: {staff.staffId}</Text>
                  </View>
                  <Pressable style={styles.editButton} onPress={() => editStaff(staff)}>
                    <FontAwesome6 name="edit" size={20} color="#4A90E2" />
                  </Pressable>
                </View>
              </TouchableOpacity>
            ))
          )}
        </SafeAreaView>
      </ScrollView>

      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f7fa',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#3F51B5',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  updateButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginTop: 20,
    marginBottom: 15,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  staffCard: {
    padding: 18,
    backgroundColor: '#d2e2e8',
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  staffInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  staffDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  editButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});