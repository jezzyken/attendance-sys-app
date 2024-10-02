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
    employmentDate: { type: Date, required: true },
    status: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
