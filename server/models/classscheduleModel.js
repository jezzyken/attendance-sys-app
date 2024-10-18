const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classScheduleSchema = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    dayOfWeek: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassSchedule", classScheduleSchema);
