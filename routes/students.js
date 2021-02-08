const { Router } = require("express");
const router = Router();

const {
  getAllStudents,
  getStudent,
} = require("../controller/students_controller");

const Student = require("../models/Student");

router.route("/").get(getAllStudents);
router.route("/:id").get(getStudent);

module.exports = router;
