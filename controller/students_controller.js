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
    res.status(200).json(students);
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
  res.status(200).json(student);
};

module.exports = studentsCrl;
