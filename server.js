const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017/Rencoders";
let client;

const JWT_SECRET = "random#secret";  

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user; 
    next(); 
  });
};

app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: "Access granted to protected route" });
});


async function connect() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
  return client;
}

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" }); 
};


app.post('/login', async (req, res) => {
  try {
    const client = await connect();
    const userCol = client.db("Rencoders").collection("users");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await userCol.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = createToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email }  
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/register', async (req, res) => {
  try {
    const client = await connect();
    const userCol = client.db("Rencoders").collection("users");
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      email: email,
      password: hashedPassword,
      isActive: false
    };
    await userCol.insertOne(newUser);

    const token = createToken(newUser._id);

    res.status(201).json({
      message: "User registered successfully",
      token 
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/profile', async (req, res) => {
  try {
    const client = await connect();
    const userCol = client.db("Rencoders").collection("users");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    //find user using the email
    const user = await userCol.findOne({ email }, { projection: { password: 0 } }); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //send user profile info
    res.status(200).json({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,  
      experience: user.experience,   
      location: user.location,        
                    
    });

  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

app.post('/profileupdate', async (req, res) => { 
  try {
    const client = await connect();
    const userCol = client.db("Rencoders").collection("users");

    const { email, name, phoneNumber, experience, location } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required to update profile" });
    }

    // Validate that at least one field to update is provided
    if (!name && !phoneNumber && !experience && !location) {
      return res.status(400).json({ error: "At least one field must be provided to update" });
    }

    // Create an object with the fields to update (only include non-null values)
    const updates = {};
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (experience) updates.experience = experience;
    if (location) updates.location = location;

    // Perform the update in the database
    const result = await userCol.updateOne({ email }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});





app.post("/addstudent", async (req, res) => {
  try {
    const client = await connect();
    const studentCol = client.db("Rencoders").collection("studentdetails");

    const { studentname, learningMode, courses } = req.body;

    if (!studentname || !learningMode || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: "Student name, learning mode, and at least one course are required" });
    }

    // Validate that each course has a courseName, courseID, and duration
    for (let course of courses) {
      if (!course.courseName || !course.courseID || !course.duration) {
        return res.status(400).json({ error: "Each course must have a courseName, courseID, and duration" });
      }
    }

    const existingStudent = await studentCol.findOne({ studentname });

    if (existingStudent) {
      return res.status(400).json({ error: "Student with this name already exists" });
    }

    // Calculate total duration
    const totalDuration = courses.reduce((sum, course) => sum + Number(course.duration), 0);

    // Generate a unique studentId 
    const studentId = new Date().getTime() % 100; 

    
    const result = await studentCol.insertOne({
      studentId,
      studentname,
      learningMode,
      totalDuration,
      courses: courses.map((course) => ({
        courseName: course.courseName,
        courseID: course.courseID,
        duration: Number(course.duration),
      })),
    });

    // Check if insertion was successful
    if (result.insertedId) {
      return res.status(201).json({
        message: "Student added successfully",
        student: {
          studentId,
          studentname,
          learningMode,
          totalDuration,
          courses,
        },
      });
    } else {
      return res.status(500).json({ error: "Failed to add student" });
    }
  } catch (error) {
    console.error("Error while adding student:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally {
    if (client) await client.close();
  }
});

app.post('/countstudent', async (req, res) => {
 
  try {
    const client = await connect();
    const studentCollection = client.db("Rencoders").collection("studentdetails");
    const countstd = await studentCollection.countDocuments(); // Get the actual count of students
    res.json({ success: true, count: countstd });
    
  
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
  finally {
    if (client) await client.close();
  }
});




  app.post("/displaystudent", async (req, res) => {
    try {
      const client = await connect();
      const studentCol = client.db("Rencoders").collection("studentdetails");
      const student = await studentCol.find({}).toArray();
      res.status(200).json(student);
    } catch (error) {
      console.log("Error fetching student:", error);
      res.status(500).json({ error: "Server Error" });
    } finally {
      if (client) await client.close();
    }
  });

 
  app.post("/updatestudent", async (req, res) => {
    try {
      const client = await connect();
      const studentCol = client.db("Rencoders").collection("studentdetails");
  
      const { studentId, studentname, courses, learningMode, totalDuration } = req.body;
  
      if (!studentId || !studentname || !learningMode || !totalDuration || !courses || !Array.isArray(courses)) {
        return res.status(400).json({ error: "All fields (studentId, studentname, courses, learningMode, totalDuration) are required" });
      }
  
     
      for (let course of courses) {
        if (!course.courseName || !course.courseID || typeof course.duration !== 'number') {
          return res.status(400).json({ error: "Each course must have courseName, courseID, and duration" });
        }
      }
  
      // Check if the student exists
      const existingStudent = await studentCol.findOne({ studentId });
      if (!existingStudent) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      // Prepare the updated student document
      const updatedStudent = {
        studentname,
        learningMode,
        totalDuration,
        courses: courses.map(course => ({
          courseName: course.courseName,
          courseID: course.courseID,
          duration: course.duration,
        })),
      };
  
      // Update the student record
      const result = await studentCol.updateOne({ studentId }, { $set: updatedStudent });
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({
          message: "Student updated successfully",
          student: updatedStudent
        });
      } else {
        return res.status(500).json({ error: "Failed to update student" });
      }
    } catch (error) {
      console.error("Error while updating student:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      if (client) await client.close();
    }
  });
  
  

  app.post("/addstaff", async (req, res) => {
    try {
      const client = await connect();
      const staffCol = client.db("Rencoders").collection("staffdetails");
      const { staffId, staffName, specificCourse } = req.body;
  
      
      if (!staffId || !staffName || !specificCourse) {
        return res.status(400).json({ error: "All fields (staffId, staffName, specificCourse) are required" });
      }
  
      if (!Array.isArray(specificCourse)) {
        return res.status(400).json({ error: "specificCourse must be an array" });
      }
  
      const existingStaff = await staffCol.findOne({ staffId });
  
      if (existingStaff) {
        return res.status(400).json({ error: "Staff member already exists" });
      }
  
      const result = await staffCol.insertOne({
        staffId,
        staffName,
        specificCourse
      });
  
      if (result.insertedId) {
        return res.status(201).json({ 
          message: "Staff added successfully", 
          staff: { 
            staffId, 
            staffName, 
            specificCourse
          } 
        });
      } else {
        return res.status(500).json({ error: "Failed to add staff" });
      }
    } catch (error) {
      console.log("Error while adding staff:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    finally {
      if (client) await client.close();
    }
  });

  app.post("/displaystaff", async (req, res) => {
    try {
      const client = await connect();
      const staffCol = client.db("Rencoders").collection("staffdetails");
      const staff = await staffCol.find({}).toArray();
      res.status(200).json(staff);
    } catch (error) {
      console.log("Error displaying staff:", error);
      res.status(500).json({ error: "Server Error" });
    } finally {
      if (client) await client.close();
    }
  });

  app.post('/countstaff', async (req, res) => {
   
  
    try {
      const client = await connect();
      const studentCollection = client.db("Rencoders").collection("staffdetails");
      const countstd = await studentCollection.countDocuments(); 
      res.json({ success: true, count: countstd }); 
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
    finally {
      if (client) await client.close();
    }
  });
  
 

  app.post("/updatestaff", async (req, res) => {
    try {
      const client = await connect(); 
      const staffCol = client.db("Rencoders").collection("staffdetails"); 
  
      const { staffId, staffName, specificCourse } = req.body;
  
     
      if (!staffId || !staffName || !specificCourse) {
        return res.status(400).json({ error: "All fields (staffId, staffName, specificCourse) are required" });
      }
  

      if (!Array.isArray(specificCourse)) {
        return res.status(400).json({ error: "specificCourse must be an array" });
      }
  
      const existingStaff = await staffCol.findOne({ staffId });
      if (!existingStaff) {
        return res.status(404).json({ error: "Staff not found" });
      }

      const updatedStaff = {
        staffId,
        staffName,
        specificCourse
      };
  
   
      const result = await staffCol.updateOne({ staffId }, { $set: updatedStaff });
  
      if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "Staff updated successfully", staff: updatedStaff });
      } else {
        return res.status(500).json({ error: "Failed to update staff" });
      }
    } catch (error) {
      console.log("Error while updating staff:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    finally {
      if (client) await client.close();
    }
  });
  
  app.post("/addcourse", async (req, res) => {
    try {
      const client = await connect();
      const courseCol = client.db("Rencoders").collection("courses");
      const { courseID, courseName, coursePrice, learningMode, duration, trainers } = req.body;
  
      if (!courseID || !courseName || !coursePrice || !learningMode || !duration || !trainers) {
        return res.status(400).json({ error: "All fields (courseID, courseName, coursePrice, learningMode, duration, trainers) are required" });
      }
  
      if (!Array.isArray(trainers)) {
        return res.status(400).json({ error: "Trainers must be an array" });
      }
  
      const existingCourse = await courseCol.findOne({ courseID });
      if (existingCourse) {
        return res.status(400).json({ error: "Course already exists" });
      }
  
      const result = await courseCol.insertOne({
        courseID,
        courseName,
        coursePrice,
        learningMode,
        duration,
        trainers
      });
  
      if (result.insertedId) {
        return res.status(201).json({
          message: "Course added successfully",
          course: {
            courseID,
            courseName,
            coursePrice,
            learningMode,
            duration,
            trainers
          }
        });
      } else {
        return res.status(500).json({ error: "Failed to add course" });
      }
    } catch (error) {
      console.log("Error while adding course:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    finally {
      if (client) await client.close();
    }
});

app.post("/displaycourses", async (req, res) => {
  try {
    const client = await connect();
    const courseCol = client.db("Rencoders").collection("courses");

    const courses = await courseCol.find({}).toArray();

    res.status(200).json(courses);
  } catch (error) {
    console.log("Error Displaying Courses:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally {
    if (client) await client.close();
  }
});




app.post("/addpaymentlist", async (req, res) => {
  try {
    const client = await connect();
    const paymentListCol = client.db("Rencoders").collection("paymentlist");

    const { StudentId, courses, amountPaid, paymentDate } = req.body;

    if (!StudentId || !courses || !amountPaid || !paymentDate) {
      return res.status(400).json({
        error: "All fields (StudentId, courses, amountPaid, paymentDate) are required",
      });
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ error: "Courses must be a non-empty array" });
    }

    // Validate each course object
    for (let i = 0; i < courses.length; i++) {
      const { courseID, courseName, coursePrice, duration } = courses[i];
      if (!courseID || !courseName || !coursePrice || !duration) {
        return res.status(400).json({
          error: `Each course must have courseID, courseName, coursePrice, duration at index ${i}`,
        });
      }
    }

    // Convert paymentDate 
    const formattedDate = new Date(paymentDate);
    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    }

    
    const result = await paymentListCol.insertOne({
      studentId: StudentId, 
      courses: courses.map((course) => ({
        courseID: course.courseID,
        courseName: course.courseName,
        coursePrice: parseFloat(course.coursePrice),
        duration: parseInt(course.duration, 10),
      })),
      amountPaid: parseFloat(amountPaid),
      paymentDate: formattedDate,
    });

   
    if (result.insertedId) {
      return res.status(201).json({
        message: "Payment added successfully",
        paymentDetails: {
          studentId: StudentId,
          courses,
          amountPaid,
          paymentDate: formattedDate,
        },
      });
    } else {
      return res.status(500).json({ error: "Failed to add payment" });
    }
  } catch (error) {
    console.log("Error while adding payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  finally {
    if (client) await client.close();
  }
});

 
app.get("/displaypaymentlist", async (req, res) => {
  try {
    const client = await connect();
    const paymentListCol= client.db("Rencoders").collection("paymentlist");

    const paymentList = await paymentListCol.find({}).toArray();

    res.status(200).json(paymentList);
  } catch (error) {
    console.log("Error Displaying Payment List:", error);
    res.status(500).json({ error: "Server Error" });
  }
  finally {
    if (client) await client.close();
  }
});




 //display
app.post("/courseschedule", async (req, res) => {
  
    try {
      const client = await connect();
      const scheduleCol = client.db("Rencoders").collection("staffSchedules");
      const staffschedule = await scheduleCol.find({}).toArray();
      res.status(200).json(staffschedule);
    } catch (error) {
      console.log("Error fetching:", error);
      res.status(500).json({ error: "Server Error" });
    }
    finally {
      if (client) await client.close();
    }
  });



app.post('/uploadSchedule', async (req, res) => {
  const { staffId, staffName, schedule } = req.body;

  try {
    const client = await connect();
    const schedulesCol = client.db("Rencoders").collection("staffSchedules");

    if (!staffId || !staffName || !Array.isArray(schedule)) {
      console.error("Invalid request body:", req.body);
      return res.status(400).json({
        error: "staffId, staffName, and schedule array are required",
      });
    }

    for (const session of schedule) {
      if (!session.day || !session.courseID || !session.courseName || !session.courseTime) {
        console.error("Invalid session:", session);
        return res.status(400).json({
          error: "Each schedule entry must include day, courseID, courseName, and courseTime",
        });
      }

      if (session.trainers && Array.isArray(session.trainers)) {
        for (const trainer of session.trainers) {
          if (!trainer.staffId || !trainer.staffName) {
            console.error("Invalid trainer:", trainer);
            return res.status(400).json({
              error: "Each trainer must have a staffId and staffName",
            });
          }
        }
      }
    }

    const scheduleData = {
      staffId,
      staffName,
      schedule,
    };

    console.log("Uploading schedule:", scheduleData);

    const result = await schedulesCol.insertOne(scheduleData);

    res.status(201).json({
      message: "Schedule uploaded successfully",
      scheduleId: result.insertedId,
    });
  } catch (error) {
    console.error("Error uploading schedule:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
  finally {
    if (client) await client.close();
  }
});



  
  app.post("/coursecomplete", async (req, res) => {
    try {
      const client = await connect();
      const studentCol = client.db("Rencoders").collection("studentdetails");
      const courseCompleteCol = client.db("Rencoders").collection("coursecomplete");
  
      const { studentId, completionThreshold = 90 } = req.body;
  
      if (studentId) {
      
      } else {
        
        const allStudents = await studentCol.find({}).toArray();
        
        const completionData = await Promise.all(allStudents.map(async (student) => {
          const totalDuration = student.courses.reduce((acc, course) => acc + (course.duration || 0), 0);
          const isComplete = totalDuration >= completionThreshold;
          
          return {
            studentId: student.studentId,
            studentName: student.studentName,
            totalDuration,
            isCourseComplete: isComplete,
            completionDate: isComplete ? new Date() : null
          };
        }));
  
        res.status(200).json({ students: completionData });
      }
  
    } catch (error) {
      console.log("Error while checking course completion:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
    finally {
      if (client) await client.close();
    }
  });

app.post("/attendance", async (req, res) => {
  try {
    const client = await connect(); 
    const attendanceCol = client.db("Rencoders").collection("attendance"); 
    const allAttendanceRecords = await attendanceCol.find({}).toArray();
    res.status(200).json(allAttendanceRecords); 
  } catch (error) {
    console.log("Error fetching:", error); 
    res.status(500).json({ error: "Server Error" }); 
  }
  finally {
    if (client) await client.close();
  }
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
console.log("Connected to MongoDB");
});
