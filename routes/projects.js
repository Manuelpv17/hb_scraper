const { Router } = require("express");
const router = Router();

const {
  getAllProjects,
  getProject,
} = require("../controller/projects_controller");

const Student = require("../models/Project");

router.route("/").get(getAllProjects);
router.route("/:id").get(getProject);

module.exports = router;
