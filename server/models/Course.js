const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    credits: { type: Number, required: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
