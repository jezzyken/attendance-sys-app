const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceItemSchema = new Schema(
  {
    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    remarks: {
      type: String,
      enum: ["present", "absent", "late"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AttendanceItem", attendanceItemSchema);
