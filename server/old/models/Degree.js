const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const degreeSchema = new Schema(
  {
    degree: { type: String, required: true },
    degreeAbr: { type: String, required: true },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Degree", degreeSchema);
