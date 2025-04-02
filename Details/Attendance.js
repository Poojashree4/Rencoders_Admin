

import React, { useState, useEffect } from 'react';
import { FlatList, Text, StyleSheet, View, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import Navbar from '../Navbar/Navbar';
import { LinearGradient } from 'expo-linear-gradient';

export default function Attendance() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    fetchAttendance();
    // Set current date in the format shown in reference
    const date = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch('http://192.168.1.5:4000/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendance');
      }

      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    }
  };

  //color based on attendance percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 85) return '#4CAF50'; // Green
    if (percentage >= 70) return '#FFC107'; // Amber
    return '#F44336'; // Red
  };

  const renderStudentCard = ({ item: student }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.studentName}>{student.studentName}</Text>
          <Text style={styles.studentDetail}>ID: {student.studentId}</Text>
        </View>
        <View style={styles.weekStatus}>
          <Text style={styles.weekDays}>M T W Th F</Text>
          <Text style={styles.weekPercentage}>100%</Text>
        </View>
      </View>
      
      {student.courses.map((course, index) => (
        <View key={`${student.studentId}-${index}`} style={styles.courseContainer}>
          <Text style={styles.courseTitle}>{course.courseName}</Text>
          <View style={styles.courseDetails}>
            <Text style={styles.courseDetail}>ID: {course.courseID}</Text>
            <Text style={styles.courseDetail}>Time: 9:30am</Text>
          </View>
          
          <View style={styles.attendanceStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>04</Text>
              <Text style={styles.statLabel}>Attendance Week</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Ongoing Days</Text>
            </View>
            <View style={styles.statItem}>
              <Progress.Circle
                size={80}
                progress={course.attendancePercentage / 100}
                showsText={true}
                formatText={() => `${course.attendancePercentage}%`}
                color={getProgressColor(course.attendancePercentage)}
                borderWidth={0}
                thickness={6}
                textStyle={styles.progressText}
              />
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Ask Leave</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Leaderboard</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <><SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Attendance</Text>
        <Text style={styles.headerSubtitle}>Take attendance today</Text>
        {/* <TouchableOpacity style={styles.submitButton}>
      <Text style={styles.submitButtonText}>Submit</Text>
    </TouchableOpacity> */}
      </View>

      <Text style={styles.dateText}>{currentDate}</Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This week status</Text>
      </View>

      <FlatList
        data={attendanceData}
        renderItem={renderStudentCard}
        keyExtractor={(item) => item.studentId}
        contentContainerStyle={styles.listContent} />
     
    </SafeAreaView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
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
  submitButton: {
    backgroundColor: '#FFC107',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
  weekStatus: {
    alignItems: 'center',
  },
  weekDays: {
    fontSize: 12,
    color: '#666',
  },
  weekPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  courseContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  courseDetail: {
    fontSize: 14,
    color: '#666',
  },
  attendanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: '#E8EAF6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
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