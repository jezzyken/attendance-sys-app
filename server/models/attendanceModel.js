const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    classScheduleId: {
      type: Schema.Types.ObjectId,
      ref: "ClassSchedule",
      required: true,
    },
    attendanceDate: { type: Date, required: true },
    daysOfWeek: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
