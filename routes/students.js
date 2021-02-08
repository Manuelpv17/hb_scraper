const { Router } = require("express");
const router = Router();

const {
  getAllStudents,
  getStudent,
  getStudentsOfCohort,
} = require("../controller/students_controller");

const Student = require("../models/Student");

router.route("/").get(getAllStudents);
router.route("/:id").get(getStudent);
router.route("/cohort/:cohort").get(getStudentsOfCohort);

module.exports = router;
