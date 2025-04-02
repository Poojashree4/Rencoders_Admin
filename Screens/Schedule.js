
import React, { useState, useEffect } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  TextInput, 
  FlatList, 
  Alert 
} from 'react-native';
import Navbar from '../Navbar/Navbar.js';

export default function Schedule() {
  const [staffId, setStaffId] = useState('');
  const [staffName, setStaffName] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [scheduleEntries, setScheduleEntries] = useState([{ 
    day: '', 
    courseID: '', 
    courseName: '', 
    courseTime: '' 
  }]);

  // Fetch schedules on component mount
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://192.168.1.5:4000/courseschedule', {
        method: 'POST',
      });
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      Alert.alert('Error', 'Failed to load schedule data');
    }
  };

  const addScheduleEntry = () => {
    setScheduleEntries([...scheduleEntries, { 
      day: '', 
      courseID: '', 
      courseName: '', 
      courseTime: '' 
    }]);
  };

  const removeScheduleEntry = (index) => {
    const newEntries = [...scheduleEntries];
    newEntries.splice(index, 1);
    setScheduleEntries(newEntries);
  };

  const updateScheduleEntry = (index, field, value) => {
    const newEntries = [...scheduleEntries];
    newEntries[index][field] = value;
    setScheduleEntries(newEntries);
  };

  const uploadSchedule = async () => {
    if (!staffId || !staffName) {
      Alert.alert('Validation Error', 'Please enter staff ID and name');
      return;
    }

    const invalidEntries = scheduleEntries.some(entry => 
      !entry.day || !entry.courseID || !entry.courseName || !entry.courseTime
    );

    if (invalidEntries) {
      Alert.alert('Validation Error', 'Please fill in all fields for each schedule entry');
      return;
    }

    const scheduleData = {
      staffId,
      staffName,
      schedule: scheduleEntries
    };

    try {
      const response = await fetch('http://192.168.1.5:4000/uploadSchedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Schedule uploaded successfully');
        fetchSchedules();
        setStaffId('');
        setStaffName('');
        setScheduleEntries([{ day: '', courseID: '', courseName: '', courseTime: '' }]);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to upload schedule');
      }
    } catch (error) {
      console.error('Error uploading schedule:', error);
      Alert.alert('Error', 'Failed to upload schedule');
    }
  };

  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleCard}>
      <Text style={styles.staffName}>{item.staffName}</Text>
      <Text style={styles.staffDetail}>Staff ID: {item.staffId}</Text>

      {item.schedule && item.schedule.map((session, idx) => (
        <View key={idx} style={styles.sessionContainer}>
          <Text style={styles.sessionDetail}>Day: {session.day}</Text>
          <Text style={styles.sessionDetail}>Course: {session.courseName} ({session.courseID})</Text>
          <Text style={styles.sessionDetail}>Time: {session.courseTime}</Text>

          {session.trainers && session.trainers.length > 0 && (
            <View style={styles.trainersContainer}>
              <Text style={styles.trainersTitle}>Trainers:</Text>
              {session.trainers.map((trainer, tIdx) => (
                <Text key={tIdx} style={styles.trainerDetail}>
                  - {trainer.staffName} ({trainer.staffId})
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
        <FlatList
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Staff Schedule Management</Text>
              
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Add New Schedule</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Staff ID"
                  value={staffId}
                  onChangeText={setStaffId}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Staff Name"
                  value={staffName}
                  onChangeText={setStaffName}
                />

                <Text style={styles.sectionTitle}>Schedule Entries</Text>

                {scheduleEntries.map((entry, index) => (
                  <View key={index} style={styles.entryContainer}>
                    <Text style={styles.entryNumber}>Entry #{index + 1}</Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Day (e.g., Monday)"
                      value={entry.day}
                      onChangeText={(text) => updateScheduleEntry(index, 'day', text)}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Course ID"
                      value={entry.courseID}
                      onChangeText={(text) => updateScheduleEntry(index, 'courseID', text)}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Course Name"
                      value={entry.courseName}
                      onChangeText={(text) => updateScheduleEntry(index, 'courseName', text)}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Course Time (e.g., 9:00-11:00)"
                      value={entry.courseTime}
                      onChangeText={(text) => updateScheduleEntry(index, 'courseTime', text)}
                    />

                    {scheduleEntries.length > 1 && (
                      <Pressable
                        style={styles.removeButton}
                        onPress={() => removeScheduleEntry(index)}
                      >
                        <Text style={styles.removeButtonText}>Remove Entry</Text>
                      </Pressable>
                    )}
                  </View>
                ))}

                <Pressable style={styles.addButton} onPress={addScheduleEntry}>
                  <Text style={styles.buttonText}>+ Add Another Schedule Entry</Text>
                </Pressable>

                <Pressable style={styles.submitButton} onPress={uploadSchedule}>
                  <Text style={styles.buttonText}>Submit Schedule</Text>
                </Pressable>
              </View>

              <Text style={styles.subtitle}>Current Schedules</Text>
            </>
          }
          data={schedules}
          renderItem={renderScheduleItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      </SafeAreaView>
      
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 20, 
    backgroundColor: 'white' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  card: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#555'
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: 'white'
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    marginVertical: 8,
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  removeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16
  },
  subtitle: {
    fontSize: 20,
    marginTop: 25,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center'
  },
  scheduleCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  entryContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d0e3ff'
  },
  entryNumber: {
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 5
  },
  staffName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  staffDetail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 10
  },
  sessionContainer: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#007BFF'
  },
  sessionDetail: {
    fontSize: 15,
    marginVertical: 3,
    color: '#444'
  },
  trainersContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  trainersTitle: {
    fontWeight: 'bold',
    color: '#555'
  },
  trainerDetail: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10,
    marginTop: 3
  },
  navbarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
});