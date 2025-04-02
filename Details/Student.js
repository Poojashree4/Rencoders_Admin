

import React, { useState, useEffect,useRef } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  View, 
  SafeAreaView, 
  TextInput, 
  ScrollView, 
  TouchableOpacity
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Navbar from '../Navbar/Navbar';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Student() {
  const [studentName, setStudentName] = useState('');
  const [learningMode, setLearningMode] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const navigation = useNavigation();
  const scrollViewRef = useRef(); // Add ref for ScrollView

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://192.168.1.5:4000/displaystudent', { 
        method: 'POST' 
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to load student data');
    }
  };

  const addCourse = () => {
    if (selectedCourse && selectedCourseId && courseDuration) {
      setCourses([...courses, { 
        courseName: selectedCourse, 
        courseID: selectedCourseId, 
        duration: parseInt(courseDuration) || 0 
      }]);
      setSelectedCourse('');
      setSelectedCourseId('');
      setCourseDuration('');
    } else {
      alert('Please select a course, course ID, and enter duration');
    }
  };

  const addOrUpdateStudent = async () => {
    if (!studentName || !learningMode || courses.length === 0) {
      alert('Please fill in all fields and add at least one course');
      return;
    }

    const totalDuration = courses.reduce((sum, course) => sum + course.duration, 0);
    const payload = {
      studentId: editingStudentId || undefined,
      studentname: studentName,
      learningMode,
      totalDuration,
      courses
    };

    try {
      const url = editingStudentId 
        ? 'http://192.168.1.5:4000/updatestudent' 
        : 'http://192.168.1.5:4000/addstudent';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(editingStudentId ? 'Student updated successfully!' : 'Student added successfully!');
        fetchStudents();
        resetForm();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save student');
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student');
    }
  };

  const resetForm = () => {
    setStudentName('');
    setLearningMode('');
    setSelectedCourse('');
    setSelectedCourseId('');
    setCourseDuration('');
    setCourses([]);
    setEditingStudentId(null);
  };

  const startEditing = (student) => {
    setStudentName(student.studentname);
    setLearningMode(student.learningMode);
    setCourses(student.courses);
    setEditingStudentId(student.studentId);
  };
  scrollViewRef.current?.scrollTo({ y: 0, animated: true });

  return (
    <>
      <ScrollView style={styles.scrollView} ref={scrollViewRef} >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Student Management</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {editingStudentId ? '✏️ Edit Student' : 'Add New Student'}
            </Text>
            
            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter student name" 
              value={studentName} 
              onChangeText={setStudentName} 
            />
                  <Text style={styles.inputLabel}>Learning Mode</Text>    
            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={learningMode}
                onValueChange={setLearningMode}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Select Learning Mode" value="" />
                <Picker.Item label="Online" value="Online" />
                <Picker.Item label="Offline" value="Offline" />
              </Picker>
            </View>


            <Text style={styles.inputLabel}>Course Name</Text>
            <View style={styles.pickerContainer}>
              
              <Picker
                selectedValue={selectedCourse}
                onValueChange={setSelectedCourse}
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

            <Text style={styles.inputLabel}>Course ID</Text>
            <View style={styles.pickerContainer}>
            
              <Picker
                selectedValue={selectedCourseId}
                onValueChange={setSelectedCourseId}
                style={styles.picker}
                dropdownIconColor="#666"
              >
                <Picker.Item label="Select Course ID" value="" />
                <Picker.Item label="MER120" value="MER120" />
                <Picker.Item label="JV200" value="JV200" />
                <Picker.Item label="PY300" value="PY300" />
                <Picker.Item label="DSA500" value="DSA500" />
                <Picker.Item label="RE400" value="RE400" />
              </Picker>
            </View>
            
            <Text style={styles.inputLabel}>Course Duration (hours)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter duration in hours" 
              keyboardType="numeric" 
              value={courseDuration} 
              onChangeText={setCourseDuration} 
            />
            
            <Pressable style={[styles.button, styles.addButton]} onPress={addCourse}>
              <Text style={styles.buttonText}>📚 Add Course</Text>
            </Pressable>

            {courses.length > 0 && (
              <View style={styles.courseList}>
                <Text style={styles.subtitle}>📋 Added Courses:</Text>
                {courses.map((course, index) => (
                  <View key={index} style={styles.courseItemContainer}>
                    <Text style={styles.courseItem}>
                       {course.courseName} 
                      {"\n"} ID: {course.courseID} 
                      {"\n"}⏱ {course.duration} hrs
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <Pressable style={[styles.button, styles.submitButton]} onPress={addOrUpdateStudent}>
              <Text style={styles.buttonText}>
                {editingStudentId ? ' Update Student' : ' Add Student'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.studentListSection}>
            <Text style={styles.sectionTitle}> Student List</Text>
            {students.length === 0 ? (
              <Text style={styles.emptyMessage}>No students added yet</Text>
            ) : (
              students.map((student) => (
                <TouchableOpacity
                  key={student.studentId}
                  style={styles.studentCard}
                  onPress={() => navigation.navigate('studentlist', { student })}
                >
                  <View style={styles.studentInfo}>
                    <View>
                      <Text style={styles.studentName}>👤 {student.studentname}</Text>
                      <Text style={styles.studentDetail}>Student ID: {student.studentId}</Text>
                      <Text style={styles.studentDetail}>Learning Mode: {student.learningMode}</Text>
                    </View>
                    <Pressable onPress={() => startEditing(student)} style={styles.editbutn}>
                      <FontAwesome6 name="edit" size={20} color="#4A90E2" />
                    </Pressable>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
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
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#3F51B5',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
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
  submitButton: {
    backgroundColor: '#6C63FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseList: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0f4ff',
    borderRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  courseItemContainer: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  courseItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  studentListSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 15,
    paddingLeft: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#6C63FF',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  studentCard: {
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
  studentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  editbutn: {
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