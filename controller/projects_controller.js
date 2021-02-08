const Student = require("../models/Student");
const Project = require("../models/Project");
const Review = require("../models/Review");
const projectsCrl = {};

projectsCrl.getAllProjects = async (req, res) => {
  const projects = await Project.find({}, { _id: 0, __v: 0 }).populate({
    path: "reviews",
    select: "-__v -_id -project_id",
  });
  res.status(200).json(projects);
};

projectsCrl.getProject = async (req, res) => {
  const project = await Project.findOne(
    { id: req.params.id },
    { _id: 0, __v: 0 }
  ).populate({
    path: "reviews",
    select: "-__v -_id -project_id",
  });
  res.status(200).json(project);
};

module.exports = projectsCrl;
