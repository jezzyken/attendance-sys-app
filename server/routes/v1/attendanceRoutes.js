const express = require("express");
const router = express.Router();
const Attendance = require("../../models/attendanceModel");
const AttendanceItem = require("../../models/attendanceItemModel");
const Student = require("../../models/studentModel");
const ClassSchedule = require("../../models/scheduleModel");
const { sendAbsenceEmail } = require("../../utils/sendEmail");

router.get("/", async (req, res) => {
  try {
    const attendanceOverview = await Attendance.aggregate([
      {
        $lookup: {
          from: "classschedules",
          localField: "classScheduleId",
          foreignField: "_id",
          as: "classSchedule",
        },
      },
      {
        $unwind: "$classSchedule",
      },
      {
        $lookup: {
          from: "courses",
          localField: "classSchedule.courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $lookup: {
          from: "teachers",
          localField: "classSchedule.teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      {
        $unwind: "$teacher",
      },
      {
        $lookup: {
          from: "classes",
          localField: "classSchedule._id",
          foreignField: "classScheduleId",
          as: "classes",
        },
      },
      {
        $project: {
          attendanceDate: 1,
          dayOfWeek: "$daysOfWeek",
          courseName: "$course.courseName",
          startTime: "$classSchedule.startTime",
          endTime: "$classSchedule.endTime",
          teacherName: {
            $concat: ["$teacher.firstName", " ", "$teacher.lastName"],
          },
          numberOfStudents: { $size: "$classes" },
        },
      },
      {
        $sort: { attendanceDate: -1 },
      },
    ]);

    res.status(200).json(attendanceOverview);
  } catch (error) {
    console.error("Error in getAttendanceOverview:", error);
    throw error;
  }
});

router.get(
  "/students/attendance/overview/attendance/:attendanceId",
  async (req, res) => {
    try {
      const { attendanceId } = req.parms;
      const studentsAttendance = await AttendanceItem.aggregate([
        {
          $match: { attendanceId: new ObjectId(attendanceId) },
        },
        {
          $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $project: {
            studentName: {
              $concat: ["$student.firstName", " ", "$student.lastName"],
            },
            remarks: 1,
          },
        },
      ]);

      res.status(200).json(studentsAttendance);
    } catch (error) {
      console.error("Error in getStudentsForAttendance:", error);
      throw error;
    }
  }
);

router.post("/", async (req, res) => {
  try {
    const { classScheduleId, attendanceDate, daysOfWeek } = req.body;
    const attendance = new Attendance({
      classScheduleId,
      attendanceDate,
      daysOfWeek,
    });
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/items", async (req, res) => {
  try {
    const attendanceItems = req.body;
    const savedItems = await AttendanceItem.insertMany(attendanceItems);

    console.log(attendanceItems);

    const classSchedule = await ClassSchedule.findById(
      attendanceItems[0].classScheduleId
    ).populate("courseId");

    for (let item of attendanceItems) {
      if (item.remarks === "absent") {
        const student = await Student.findById(item.studentId);
        if (student && student.guardianEmail) {
          await sendAbsenceEmail(
            student.guardianEmail,
            `${student.firstName} ${student.lastName}`,
            classSchedule.courseId.courseName,
            new Date().toLocaleDateString()
          );
        }
      }
    }

    res.status(201).json(savedItems);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/class/:classScheduleId", async (req, res) => {
  try {
    const { classScheduleId } = req.params;
    const attendance = await Attendance.find({ classScheduleId });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:attendanceId/items", async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const items = await AttendanceItem.find({ attendanceId }).populate(
      "studentId"
    );
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/class/:classScheduleId/date/:date", async (req, res) => {
  try {
    const { classScheduleId, date } = req.params;
    const attendance = await Attendance.findOne({
      classScheduleId,
      attendanceDate: new Date(date),
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    const attendanceItems = await AttendanceItem.find({
      attendanceId: attendance._id,
    }).populate("studentId");

    res.json({ attendance, attendanceItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/items/:attendanceId", async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const updatedItems = req.body;

    for (let item of updatedItems) {
      await AttendanceItem.findOneAndUpdate(
        { attendanceId, studentId: item.studentId },
        { remarks: item.remarks },
        { new: true }
      );
    }

    res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
