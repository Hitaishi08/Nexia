const express = require('express');
const { generateEmployeeReport ,generateProjectReport} = require("../controllers/reportController")

const router = express.Router();

// Route for generating the employee report
router.get('/generate-employee-report', generateEmployeeReport);
router.get('/project-report', generateProjectReport);

module.exports =router;
