const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const serverRoutes = require('./routes/serverRoutes')

// const userRoutes = require('./routes/userRoutes');
// const departmentRoutes = require('./routes/departmentRoutes');
// const teacherRoutes = require('./routes/teacherRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const degreeRoutes = require('./routes/degreeRoutes');
// const studentRoutes = require('./routes/studentRoutes');
// const classRoutes = require('./routes/classRoutes');
// const classScheduleRoutes = require('./routes/classScheduleRoutes');
// const attendanceRoutes = require('./routes/attendanceRoutes');
// const authRoutes = require('./routes/authRoutes'); 

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
// app.use('/api/users', userRoutes);
// app.use('/api/departments', departmentRoutes);
// app.use('/api/teachers', teacherRoutes);
// app.use('/api/courses', courseRoutes);
// app.use('/api/degrees', degreeRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/attendances', attendanceRoutes);
// app.use('/api/classSchedules', classScheduleRoutes);
// app.use('/api/auth', authRoutes);

serverRoutes(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
