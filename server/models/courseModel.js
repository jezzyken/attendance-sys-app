const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema(
  {
    courseName: { type: String, required: true },
    courseCode: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    programId: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
