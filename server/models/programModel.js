const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const programSchema = new Schema(
  {
    program: { type: String, required: true },
    programAbr: { type: String, required: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Program", programSchema);
