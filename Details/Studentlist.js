

import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import Navbar from '../Navbar/Navbar';
const Studentlist = ({ route }) => {
  const { student } = route.params; // Retrieve the student details

  return (
    <><ScrollView style={styles.container}>
      {/* Profile Image - Placeholder */}
      <Image
        source={{ uri: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png' }} // Corrected image source
        style={styles.profileImage} />

      <Text style={styles.name}>{student.studentname}</Text>
      <Text style={styles.title}>Student Details</Text>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Student ID:</Text>
        <Text style={styles.detailValue}>{student.studentId}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Learning Mode:</Text>
        <Text style={styles.detailValue}>{student.learningMode}</Text>
      </View>

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Total Duration:</Text>
        <Text style={styles.detailValue}>{student.totalDuration} hrs</Text>
      </View>

      {/* <View style={styles.detailContainer}>
      <Text style={styles.detailLabel}>Student Status:</Text>
      <Text style={styles.detailValue}>{student.status} </Text>
    </View> */}

      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Student Status:</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: student.status === 'Active' ? 'green' : 'red' }
            ]} />
          <Text
            style={[
              styles.detailValue,
              { color: student.status === 'Active' ? 'green' : 'red' }
            ]}
          >
            {student.status}
          </Text>
        </View>
      </View>


      <Text style={styles.sectionTitle}>Courses:</Text>
      {student.courses.map((course, index) => (
        <View key={index} style={styles.courseContainer}>
          <Text style={styles.courseName}>📘 {course.courseName}</Text>
          <Text style={styles.courseDetail}>🆔 Course ID: {course.courseID}</Text>
          <Text style={styles.courseDetail}>⏳ Duration: {course.duration} hrs</Text>
        </View>
      ))}

    </ScrollView><View style={styles.navbarContainer}>
        <Navbar />
      </View></>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,  // Ensures the screen takes full height
    padding: 25,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 25,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
  },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 15,
//     color: '#333',
//   },
  courseContainer: {
    marginBottom: 10,
  },
  courseItem: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#4B0082', // Dark purple for a professional look
    textAlign: 'center',
  },
  courseContainer: {
    backgroundColor: '#E6E6FA', // Light lavender background
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3, // For Android shadow effect
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B0082', // Dark purple
    marginBottom: 5,
  },
  courseDetail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },

  
 
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  }
});

export default Studentlist;
