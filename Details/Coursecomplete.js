import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import Navbar from '../Navbar/Navbar';
export default function CourseComplete() {
  const [completionData, setCompletionData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    fetchCompletionData();
    // Set current date
    const date = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const fetchCompletionData = async () => {
    try {
      const response = await fetch('http://192.168.1.5:4000/coursecomplete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completionThreshold: 90 // Set your completion threshold here
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch completion data');
      }

      const data = await response.json();
      setCompletionData(data.students || []);
    } catch (error) {
      console.error('Error fetching completion data:', error);
      Alert.alert('Error', 'Failed to load course completion data');
    }
  };

  const renderCompletionCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.studentDetail}>ID: {item.studentId}</Text>
        </View>
        <View style={styles.completionBadge}>
          <Text style={[
            styles.completionText,
            { color: item.isCourseComplete ? '#4CAF50' : '#F44336' }
          ]}>
            {item.isCourseComplete ? 'COMPLETED' : 'IN PROGRESS'}
          </Text>
        </View>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Total Duration:</Text>
          <Text style={styles.detailValue}>{item.totalDuration} hours</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Completion Date:</Text>
          <Text style={styles.detailValue}>
            {item.completionDate ? new Date(item.completionDate).toLocaleDateString() : 'Not completed'}
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Progress.Bar 
            progress={item.totalDuration / 100} // Assuming 100 is max
            width={200}
            height={10}
            color={item.isCourseComplete ? '#4CAF50' : '#FFC107'}
            borderRadius={5}
          />
          <Text style={styles.progressText}>
            {Math.min(100, Math.round(item.totalDuration))}% Complete
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Certificate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Course Completion</Text>
        <Text style={styles.headerSubtitle}>Track student progress</Text>
      </View>
      
      <Text style={styles.dateText}>{currentDate}</Text>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Completion Status</Text>
      </View>
    
      <FlatList
        data={completionData}
        renderItem={renderCompletionCard}
        keyExtractor={(item) => item.studentId}
        
        contentContainerStyle={styles.listContent}
      />
      
      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Settings</Text>
        </TouchableOpacity>
      </View> */}
      <View style={styles.navbarContainer}>
        <Navbar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    paddingVertical: 12,
    backgroundColor: '#E8EAF6',
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
  },
  completionBadge: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailsContainer: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  progressContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#E8EAF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '48%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#3F51B5',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#3F51B5',
    fontSize: 12,
  },
});