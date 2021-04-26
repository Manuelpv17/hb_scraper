const Student = require("../models/Student");
const Project = require("../models/Project");
const Review = require("../models/Review");
const studentsCrl = {};

studentsCrl.getAllStudents = async (req, res) => {
  if (req.query.cohort) {
    const students = await Student.find(
      {
        cohort: req.query.cohort,
      },
      { _id: 0, __v: 0 }
    ).populate({ path: "reviews", select: "-__v -_id -student_id" });
    if (students.length) res.status(200).json(students);
    else
      res
        .status(404)
        .json({ message: `Cohort '${req.query.cohort}' not found` });
  } else {
    const students = await Student.find({}, { _id: 0, __v: 0 }).populate({
      path: "reviews",
      select: "-__v -_id -student_id",
    });
    res.status(200).json(students);
  }
};

studentsCrl.getStudent = async (req, res) => {
  const student = await Student.findOne(
    { id: req.params.id },
    { _id: 0, __v: 0 }
  ).populate({ path: "reviews", select: "-__v -_id -student_id" });
  if (student) res.status(200).json(student);
  else
    res.status(404).json({ message: `Student '${req.params.id}' not found` });
};

module.exports = studentsCrl;
