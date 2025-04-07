const PDFKit = require('pdfkit');
const User = require('../models/User'); // Assuming you have the User model imported
const Project = require('../models/project'); 
// Generate Employee Report
async function generateEmployeeReport(req, res) {
  try {
    // Fetch users with only 'username' and 'email' from the User schema
    const employees = await User.find({}, "username email"); // Adjusted based on your schema

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employee records found." });
    }

    // Create a new PDF document
    const doc = new PDFKit();
    const fileName = "Employee_Report.pdf";

    // Set headers for the response to indicate a PDF file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Title Section
    doc.text("Company", { align: "center", fontSize: 18 });
    doc.text("Employee Report", { align: "center", fontSize: 14 });
    doc.moveDown(1);  // Add space between title and table

    // Table Header
    const headers = ["Name", "Email"];
    const headerWidth = [150, 250];  // Adjusted column width for two columns
    const rowHeight = 20;  // Height for each row
    const startY = doc.y;  // Starting Y position for the table

    // Draw table header cells
    doc.rect(50, startY, headerWidth[0], rowHeight).stroke();
    doc.rect(200, startY, headerWidth[1], rowHeight).stroke();
    doc.text(headers[0], 60, startY + 5);
    doc.text(headers[1], 210, startY + 5);
    doc.moveDown(1); // Add space after header

    // Draw a line after the header to separate it
    doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(450, doc.y).stroke();
    doc.moveDown(0.5); // Move down to next row after header line

    // Table Content - Employees Data
    employees.forEach((emp) => {
      const rowY = doc.y;  // Track Y position for each row

      // Draw the border for each cell in the row
      doc.rect(50, rowY, headerWidth[0], rowHeight).stroke();
      doc.text(emp.username, 60, rowY + 5);

      doc.rect(200, rowY, headerWidth[1], rowHeight).stroke();
      doc.text(emp.email, 210, rowY + 5);

      doc.moveDown(1); // Move to next row
    });

    // Footer with generation date
    doc.moveDown(1);
    doc.fontSize(10).text("Generated on: " + new Date().toLocaleString(), { align: "right" });

    // End the document
    doc.end();

  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating employee report" });
  }
};

async function generateProjectReport(req, res) {
  try {
    // Fetch projects from the database
    const projects = await Project.find({}, "projectname projectStatus startDate DueDate members");

    if (projects.length === 0) {
      return res.status(404).json({ message: "No project records found." });
    }

    // Create a new PDF document
    const doc = new PDFKit();
    const fileName = "Project_Report.pdf";

    // Set headers for the response to indicate a PDF file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Title Section
    doc.text("PROJECT", { align: "center", fontSize: 18 });
    doc.text("Project Report", { align: "center", fontSize: 14 });
    doc.moveDown(1);  // Add space between title and table

    // Table Header
    const headers = ["Project Name", "Status", "Start Date", "Due Date"];
    const headerWidth = [200, 150, 100, 100];  // Adjusted column widths
    const rowHeight = 20;  // Height for each row
    const startY = doc.y;  // Starting Y position for the table

    // Draw table header cells
    doc.rect(50, startY, headerWidth[0], rowHeight).stroke();
    doc.rect(250, startY, headerWidth[1], rowHeight).stroke();
    doc.rect(400, startY, headerWidth[2], rowHeight).stroke();
    doc.rect(500, startY, headerWidth[3], rowHeight).stroke();
    doc.text(headers[0], 60, startY + 5);
    doc.text(headers[1], 260, startY + 5);
    doc.text(headers[2], 410, startY + 5);
    doc.text(headers[3], 510, startY + 5);
    doc.moveDown(1); // Add space after header

    // Draw a line after the header to separate it
    doc.lineWidth(0.5).moveTo(50, doc.y).lineTo(600, doc.y).stroke();
    doc.moveDown(0.5); // Move down to next row after header line

    // Table Content - Projects Data
    projects.forEach((proj) => {
      const rowY = doc.y;  // Track Y position for each row

      // Draw the border for each cell in the row
      doc.rect(50, rowY, headerWidth[0], rowHeight).stroke();
      doc.text(proj.projectname, 60, rowY + 5);

      doc.rect(250, rowY, headerWidth[1], rowHeight).stroke();
      doc.text(proj.projectStatus || "Ongoing", 260, rowY + 5);

      doc.rect(400, rowY, headerWidth[2], rowHeight).stroke();
      doc.text(proj.startDate.toLocaleDateString(), 410, rowY + 5);

      doc.rect(500, rowY, headerWidth[3], rowHeight).stroke();
      doc.text(proj.DueDate.toLocaleDateString(), 510, rowY + 5);

      doc.moveDown(1); // Move to next row
    });

    // Footer with generation date
    doc.moveDown(1);
    doc.fontSize(10).text("Generated on: " + new Date().toLocaleString(), { align: "right" });

    // End the document
    doc.end();

  } catch (error) {
    console.error("Error generating project report:", error);
    res.status(500).json({ message: "Error generating project report" });
  }
}


module.exports = { generateEmployeeReport ,generateProjectReport };





