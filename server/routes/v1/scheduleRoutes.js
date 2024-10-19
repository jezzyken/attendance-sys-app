const express = require("express");
const router = express.Router();
const CONTROLLER = require("../../controllers/scheduleController");

const ScheduleModel = require("../../models/scheduleModel");

const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", CONTROLLER.getAll);
router.get("/:id", CONTROLLER.getById);
router.get("/teacher/:id", CONTROLLER.getByTeacherId);
router.post("/", CONTROLLER.add);
router.put("/:id", CONTROLLER.update);
router.delete("/:id", CONTROLLER.remove);

router.get("/class/schedule/:id", CONTROLLER.getClassSchedules);

router.get("/teacher/student/count/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const aggregateQuery = [
      {
        $match: { teacherId: new ObjectId(teacherId) }
      },
      {
        $lookup: {
          from: "classes",
          localField: "_id",
          foreignField: "classScheduleId",
          as: "classes"
        }
      },
      {
        $unwind: "$classes"
      },
      {
        $group: {
          _id: "$teacherId",
          totalStudents: { $addToSet: "$classes.studentId" }
        }
      },
      {
        $project: {
          _id: 0,
          teacherId: "$_id",
          totalStudents: { $size: "$totalStudents" }
        }
      }
    ];

    const result = await ScheduleModel.aggregate(aggregateQuery);
    
    if (result.length === 0) {
      return res.status(404).json({ message: "Teacher not found or has no students" });
    }
    
    res.json(result[0]);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching total student count for teacher", error: error.message });
  }
});

module.exports = router;
