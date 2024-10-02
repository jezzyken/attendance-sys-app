const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classScheduleSchema = new Schema(
  {
    subject: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    dayOfWeek: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ClassSchedule", classScheduleSchema);
