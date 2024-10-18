const MODEL = require("../models/classScheduleModel");
const COURSE_MODEL = require("../models/courseModel");
const STUDENT_MODEL = require("../models/studentModel");
const CLASS_MODEL = require("../models/classModel");

const getAll = async () => {
  return await MODEL.find().populate("courseId");
};

const getById = async (id) => {
  return await MODEL.findById(id).populate("courseId");
};

const getByTeacherId = async (teacherId) => {
  return await MODEL.find({ teacherId }).populate("courseId");
};

const add = async (data) => {
  const { courseId, students } = data;

  const course = await COURSE_MODEL.findById(courseId);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  if (students && students.length > 0) {
    const validStudents = await STUDENT_MODEL.find({ _id: { $in: students } });
    if (validStudents.length !== students.length) {
      throw new AppError("One or more students not found", 404);
    }
  }

  const newSchedule = new MODEL(data);
  const savedSchedule = await newSchedule.save();

  if (students && students.length > 0) {
    const classPromises = students.map((studentId) =>
      CLASS_MODEL.findOneAndUpdate(
        { studentId, courseId, classScheduleId: savedSchedule._id },
        { $set: { studentId, courseId, classScheduleId: savedSchedule._id } },
        { upsert: true, new: true }
      )
    );
    await Promise.all(classPromises);
  }

  return savedSchedule;
};

const update = async (id, data) => {
  const { courseId, students } = data;

  if (courseId) {
    const course = await COURSE_MODEL.findById(courseId);
    if (!course) {
      throw new AppError("Course not found", 404);
    }
  }

  if (students && students.length > 0) {
    const validStudents = await STUDENT_MODEL.find({ _id: { $in: students } });
    if (validStudents.length !== students.length) {
      throw new AppError("One or more students not found", 404);
    }
  }

  const updatedSchedule = await MODEL.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (students !== undefined) {
    await CLASS_MODEL.deleteMany({
      classScheduleId: id,
      studentId: { $nin: students },
    });

    if (students && students.length > 0) {
      const classPromises = students.map((studentId) =>
        CLASS_MODEL.findOneAndUpdate(
          {
            studentId,
            courseId: updatedSchedule.courseId,
            classScheduleId: updatedSchedule._id,
          },
          {
            $set: {
              studentId,
              courseId: updatedSchedule.courseId,
              classScheduleId: updatedSchedule._id,
            },
          },
          { upsert: true, new: true }
        )
      );
      await Promise.all(classPromises);
    }
  }

  return updatedSchedule;
};

const remove = async (id) => {
  await CLASS_MODEL.deleteMany({ classScheduleId: id });
  return await MODEL.findByIdAndDelete(id);
};

module.exports = {
  getAll,
  getById,
  getByTeacherId,
  add,
  update,
  remove,
};
