const MODEL = require("../models/classModel");
const ObjectId = require("mongoose").Types.ObjectId;

const getAll = async () => {
  return await MODEL.find();
};

const getByClassScheduleId = async (req) => {
  const { classScheduleId } = req.query;
  return await MODEL.find({
    classScheduleId: new ObjectId(classScheduleId),
  });
};

const getStudentSchedule = async (req) => {
  const { id } = req.params;

  const classes = await MODEL.find({
    classScheduleId: new ObjectId(id),
  })
    .populate({
      path: "studentId", 
      select: "firstName middleName lastName yearLevel programId",
      populate: {
        path: "programId",
        select: "programAbr",
      },
    })
    .populate("courseId", "courseName courseCode");

  if (!classes.length) {
    return { message: "No students found for this class schedule" };
  }

  return classes.map((classDoc) => ({
    _id: classDoc._id,
    student: {
      _id: classDoc.studentId._id,
      fullName: getFullName(
        classDoc.studentId.firstName,
        classDoc.studentId.middleName,
        classDoc.studentId.lastName,
      ),
      yearLevel: classDoc.studentId.yearLevel,
      program: classDoc.studentId.programId?.programAbr || "N/A",
      
    },
    course: classDoc.courseId,
  }));
};

const getById = async (id) => {
  return await MODEL.findById(id);
};

const add = async (data) => {
  const newItem = new MODEL(data);
  return await newItem.save();
};

const update = async (id, data) => {
  return await MODEL.findByIdAndUpdate(id, data, { new: true });
};

const remove = async (id) => {
  return await MODEL.findByIdAndDelete(id);
};

const getFullName = (firstName, middleName, lastName) => {
  if (middleName) {
    return `${firstName} ${middleName} ${lastName}`;
  }
  return `${firstName} ${lastName}`;
};

module.exports = {
  getAll,
  getById,
  getByClassScheduleId,
  getStudentSchedule,
  add,
  update,
  remove,
};
