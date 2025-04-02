
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image, Dimensions } from 'react-native';

import Login from './frontend/Login/Login.js'; 
import Adminhome from './frontend/Adminhome/Adminhome.js';
import Student from './frontend/Details/Student.js';
import Schedule from './frontend/Screens/Schedule.js';
import Profile from './frontend/Screens/Profile.js';
import Trainer from './frontend/Details/Trainer.js';
import Course from './frontend/Details/Course.js';
import Payment from './frontend/Details/Payment.js';
import Attendance from './frontend/Details/Attendance.js';
import CourseComplete from './frontend/Details/Coursecomplete.js';
import Studentlist from './frontend/Details/Studentlist.js';
import Trainerlist from './frontend/Details/Trainerslist.js';
import Notification from './frontend/Screens/Notification.js';
import Editprofile from './frontend/Screens/Editprofile.js';


const Stack = createNativeStackNavigator();

export default function App() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const logo = () => (
    <Image
      source={{ uri: "https://renambl.blr1.cdn.digitaloceanspaces.com/rcoders/web/Rencoders_logo.png" }}
      style={{ width: windowWidth * 0.2, height: windowHeight * 0.02 }} 
    />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{
            headerRight: logo,  
            title: 'Login',
            headerShown: false,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: 'white', height: 10 },
            headerTitleStyle: { fontSize: 16, color: 'black' },
          }}
        />
        <Stack.Screen name="adminhome" component={Adminhome}
          options={{
            headerRight: logo,  
            title: 'Home',
            headerTitleAlign: 'center',
            headerShown: false,
            headerStyle: {
              backgroundColor: 'rgb(206 ,234,214)',  
            },
          }}
        />
        <Stack.Screen name="student" component={Student}
          options={{
            headerRight: logo,  
            title: 'Students',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="schedule" component={Schedule} options={{  headerRight: logo,  title: 'Schedule', headerTitleAlign: 'center', headerStyle:{ backgroundColor:'rgb(206 ,234,214)',},
          }}
        />
        <Stack.Screen name="profile" component={Profile} options={{ headerRight: logo,   title: 'Profile', headerTitleAlign: 'center', headerShown: false, }}
        />
      <Stack.Screen name="trainer" component={Trainer} options={{ headerRight: logo,   title: 'Trainer', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
    },
  }}
/>
<Stack.Screen name="trainerlist" component={Trainerlist} options={{ headerRight: logo,   title: 'Trainers List', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
    },
  }}
/>

        <Stack.Screen name="course" component={Course}
          options={{
            headerRight: logo, 
            title: 'Courses',
            headerTitleAlign: 'center',  
          }}
        />
        
        <Stack.Screen name="payment" component={Payment}
          options={{
            headerRight: logo, 
            title: 'Payment',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="attendance" component={Attendance}
          options={{
            headerRight: logo,  
            title: 'Attendance',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen name="coursecomplete" component={CourseComplete}
          options={{
            headerRight: logo, 
            title: 'Completion',
            headerTitleAlign: 'center',
          }}
        />

<Stack.Screen name="studentlist" component={Studentlist} options={{ headerRight: logo,   title: 'Student List', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
    },
  }}
/>

<Stack.Screen name="notification" component={Notification} options={{ headerRight: logo,   title: 'Settings', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
    },
  }}
/>
<Stack.Screen name="editprofile" component={Editprofile} options={{ headerRight: logo,   title: 'Edit Profile', headerTitleAlign: 'center',headerStyle: { backgroundColor: 'white', 
    },
  }}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}


