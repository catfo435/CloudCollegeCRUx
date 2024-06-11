const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors') 
const [Student,Instructor,Course] = require('./models/exports.js');
const nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken')

require('dotenv').config()


const app = express();
const port = 3000;

let corsOptions = { 
  origin : [process.env.FRONTEND_URL],  //put this in env later
}

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 587,
  auth: {
      user: process.env.ZOHO_USERNAME,
      pass: process.env.ZOHO_PWD
  }
})   

// Middleware
app.use(cors(corsOptions))
app.use(bodyParser.json()); //limit for request size, the profile picture might be too big and exceed the limit.

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Connection error', err);
});

//--------- MISCELLANEOUS -------------

app.get('/profile-pic', async (req, res) => {
  const {url} = req.query
  try {
    const response = await fetch(url);
    res.send(response);
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching the profile picture');
  }
})

app.get('/livestreamtoken', async (req, res) => {
  const {courseId, userId} = req.query
  const API_KEY = process.env.VIDEOSDK_KEY
    const SECRET = process.env.VIDEOSDK_SECRET

    const options = { 
    expiresIn: '120m', 
    algorithm: 'HS256' 
    }

    const payload = {
      apikey: API_KEY,
      permissions: [`allow_join`], // `ask_join` || `allow_mod` 
      }
    
    const token = jwt.sign(payload, SECRET, options)
    res.status(201).send({token})
});

//--------- STUDENTS CRUD -------------


// Create a new student
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
});

// Read all students
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
});

// Read a student by email
app.get('/students/:email', async (req, res) => {
  try {
    const student = await Student.findOne({ email: req.params.email });
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
});

// Route to get wallet balance of a student by ID
app.get('/students/:id/wallet', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by ID
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Respond with the student's wallet balance
    res.status(200).json({ wallet: student.wallet });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the wallet balance.' });
  }
});

// Route to add balance to the student's wallet by ID
app.patch('/students/:id/addWallet', async (req, res) => {
  const { id } = req.params;
  let { amount } = req.body;

  amount = parseInt(amount)

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. It must be a positive number.' });
  }

  try {
    // Find the student by ID and update their wallet balance
    const student = await Student.findByIdAndUpdate(
      id,
      { $inc: { wallet: amount } }, // Increment the wallet balance by the amount
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Respond with the updated student information
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error,message: 'An error occurred while updating the wallet balance.' });
  }
})

app.patch('/students/:email/addCourse', async (req, res) => {
  const { email } = req.params;
  const { _id } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    let student = await Student.findOne({ email: email })

    if (parseInt(student.wallet) < parseInt(course.price)) {
      return res.status(406).send("No sufficient funds")
    }

    student = await Student.findOneAndUpdate(
      { email: email },
      { $addToSet: { courses: course._id } , wallet : (parseInt(student.wallet) - course.price).toString() },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    try{
      const info = await transporter.sendMail({
        from : process.env.ZOHO_USERNAME,
        to: student.email, // list of receivers
        subject: `CloudCollege : Enrolled in ${course.courseId} : ${course.name} succesfully`, // Subject line
        text: "Your enrollment in the course has been successful. You can now view the course content.", // plain text body
      })
    }
    catch (error){
      console.log(error)
      res.status(200).json({ error,message: 'An error occurred while sending the confirmation mail' })
    }

    res.status(200).json(student);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error,message: 'An error occurred while adding the course to the student\'s list.' });
  }
});

app.patch('/students/:email/removeCourse', async (req, res) => {
  const { email } = req.params;
  const { _id } = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Find the student by email and update their course list
    const student = await Student.findOneAndUpdate(
      { email: email },
      { $pull: { courses: course._id } },
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    try{
      const info = await transporter.sendMail({
        from : process.env.ZOHO_USERNAME,
        to: student.email, // list of receivers
        subject: `CloudCollege : Unenrolled from ${course.courseId} : ${course.name} succesfully`, // Subject line
        text: "You have been unenrolled from the course successfully.", // plain text body
      })
    }
    catch (error){
      console.log(error)
      res.status(200).json({ error: 'An error occurred while sending the confirmation mail' })
    }

    res.status(200).json(student);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while adding the course to the student\'s list.' });
  }
});

//Get all the courses the student is enrolled in
app.get('/students/:email/courses', async (req, res) => { //change this to find by objectid when u store id in localstorage
  try {
    const student = await Student.findOne({ email: req.params.email })
    let courses = await Course.find({"_id":{"$in" : student.courses}})
    
    
    for (let i=0;i<courses.length;i++){
      courses[i] = {...(courses[i])._doc,instructors : await Instructor.find({"_id":{"$in" : courses[i].instructors}})}
    }
    
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(courses);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
})

// Update a student by instituteId
app.patch('/students/:instituteId', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'name', 'phone', 'college', 'profile_picture', 'instituteId', 'courses'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const result = await Student.updateOne({ instituteId: req.params.instituteId }, { $set: req.body });

    if (result.n === 0) {
      return res.status(404).send();
    }

    res.status(200).send(result);
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
});

// Delete a student by instituteId
app.delete('/students/:instituteId', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ instituteId: req.params.instituteId });

    if (!student) {
      return res.status(404).send();
    }

    res.status(200).send(student);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
});


//--------- INSTRUCTORS CRUD -------------

// Create a new instructor
app.post('/instructors', async (req, res) => {
    try {
      const instructor = new Instructor(req.body);
      await instructor.save();
      res.status(201).send(instructor);
    } catch (error) {
    console.error(error)
      res.status(400).send(error);
    }
  });
  
  // Read all instructors
  app.get('/instructors', async (req, res) => {
    try {
      const instructors = await Instructor.find();
      res.status(200).send(instructors);
    } catch (error) {
    console.error(error)
      res.status(500).send(error);
    }
  });
  
  // Read an instructor by instituteId
  app.get('/instructors/:email', async (req, res) => {
    try {
      const instructor = await Instructor.findOne({ email: req.params.email });
      if (!instructor) {
        return res.status(404).send();
      }
      res.status(200).send(instructor);
    } catch (error) {
    console.error(error)
      res.status(500).send(error);
    }
  });

  app.get('/instructors/:email/courses', async (req, res) => { //change this to find by objectid when u store id in localstorage
    try {
      const instructor = await Instructor.findOne({ email: req.params.email })
      let courses = await Course.find({"_id":{"$in" : instructor.courses}})
      
      for (let i=0;i<courses.length;i++){
        courses[i] = {...(courses[i])._doc,instructors : await Instructor.find({"_id":{"$in" : courses[i].instructors}})}
      }
   
      if (!instructor) {
        return res.status(404).send();
      }
      res.status(200).send(courses);
    } catch (error) {
    console.error(error)
      res.status(500).send(error);
    }
  })
  
  // Update an instructor by instituteId
  app.patch('/instructors/:instituteId', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['email', 'name', 'profile_picture', 'instituteId'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
  
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!' });
    }
  
    try {
      const result = await Instructor.updateOne({ instituteId: req.params.instituteId }, { $set: req.body });
  
      if (result.n === 0) {
        return res.status(404).send();
      }
  
      res.status(200).send(result);
    } catch (error) {
    console.error(error)
      res.status(400).send(error);
    }
  });
  
  // Delete an instructor by instituteId
  app.delete('/instructors/:instituteId', async (req, res) => {
    try {
      const instructor = await Instructor.findOneAndDelete({ instituteId: req.params.instituteId });
  
      if (!instructor) {
        return res.status(404).send();
      }
  
      res.status(200).send(instructor);
    } catch (error) {
    console.error(error)
      res.status(500).send(error);
    }
  });


//--------- COURSES CRUD -------------

// Create a new course
app.post('/courses', async (req, res) => {
  try {

    const instructorsExist = await Promise.all(req.body.instructors.map(async (instituteId) => {
      return await Instructor.exists({ _id: instituteId });
    }));

    if (instructorsExist.includes(null)) {
      return res.status(404).send({ error: 'One or more instructors not found' });
    }

    const course = new Course(req.body);

    await Instructor.findOneAndUpdate(
      { email: req.body.email },
      { $addToSet: { courses: course._id } }, // Use $addToSet to avoid duplicates
      { new: true }
    )

    await course.save();
    res.status(201).send(course);
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
});

// Read all courses
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    for (let i=0;i<courses.length;i++){
      courses[i] = {...(courses[i])._doc,instructors : await Instructor.find({"_id":{"$in" : courses[i].instructors}})}
    }
    res.status(200).send(courses);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
});

// Read a course by id
app.get('/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.courseId });
    if (!course) {
      return res.status(404).send();
    }
    res.status(200).send(course);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
});

// Update a course by courseId
app.patch('/courses/:courseId', async (req, res) => {

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'instructors'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {

    const instructorsExist = await Promise.all(req.body.instructors.map(async (instituteId) => {
      return await Instructor.exists({ _id: instituteId });
    }));

    if (instructorsExist.includes(null)) {
      return res.status(404).send({ error: 'One or more instructors not found' });
    }

    const course = await Course.findOneAndUpdate({ _id: req.params.courseId }, req.body, { new: true });

    if (!course) {
      return res.status(404).send();
    }

    res.status(200).send(course);
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
});

// Update the livestream roomId
app.post('/courses/:courseId/livestream', async (req, res) => {

  const updates = Object.keys(req.body);
  const allowedUpdates = ['roomId'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const course = await Course.findOneAndUpdate({ _id: req.params.courseId }, req.body, { new: true });

    if (!course) {
      return res.status(404).send();
    }

    res.status(200).send(course);
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
})

// Add topic to a course by courseId
app.patch('/courses/:courseId/addContent', async (req, res) => {

  try {

    course = await Course.findOneAndUpdate({ _id: req.params.courseId }, {$push : {content : req.body}}, { new: true });

    if (!course) {
      return res.status(404).send();
    }

    res.status(200).send(course);
  } catch (error) {
    console.error(error)
    res.status(400).send(error);
  }
})

// Delete a course by courseId
app.delete('/courses/:courseId', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ courseId: req.params.courseId });

    if (!course) {
      return res.status(404).send();
    }

    res.status(200).send(course);
  } catch (error) {
    console.error(error)
    res.status(500).send(error);
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port} connected to ${process.env.MONGODB_URL}`);
});
