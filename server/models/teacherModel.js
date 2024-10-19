const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teacherSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    suffix: { type: String },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true },
    employmentDate: { type: Date },
    status: { type: String, required: true },
    password: { type: String, required: true, default: "gitteacheraccess" },
    role: { type: String, required: true, default: "teacher" },
    departmentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Department",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
