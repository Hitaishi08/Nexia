const Project = require('../models/project');
const User = require('../models/user');
const PDFDocument = require('pdfkit');
const fs = require('fs');
async function HandleToPostProject(req,res){
    const {projectname , projectdescription,members,createdBy,startDate,DueDate} = req.body;
    const id = req.user.userData.id;
    if(!projectname || !projectdescription || !members || !startDate || !DueDate)
    {
        return res.status(404).json({"error" : "all fields are required"});
    }
    
    try{
        const user = await User.findById(id);

        if(!user)return res.status(404).json({"error" : "user not found"});

        let Allmemebers = [];
        let error = [];

        if(members.length > 0){
            await Promise.all(members.map(async function(m){
                if(!m.username){
                    error.push("username is required for all members");
                }
                else{
                    const user = await User.findOne({username : m.username});

                    if(!user)
                    {
                        error.push({username : m.username, error : "not found"})
                    }
                    else{
                    const name = user.username;
                    Allmemebers.push({username : name , role : m.role});
                    }
                }
            }))
        }

        if (error.length > 0) {
            return res.status(400).json({ "errors": error });
        }

        const newProject = await Project.create({
            projectname : projectname,
            projectdescription : projectdescription,
            members : Allmemebers,
            createdBy : id,
            startDate : new Date(startDate),
            DueDate : new Date(DueDate),
        })

        // console.log(newProject);
        return res.status(200).json({success : "project created successfully"})
    }catch(err){
        console.log(err);
    }
}

async function HandleToGetProject(req, res) {
    try {
        const id = req.params.id;
        console.log(id);
        const name = req.user.userData.username;
        console.log(name);

        // Get projects created by the user
        const projectAsCreater = await Project.find({ createdBy: id });

        // Get projects where the user is a member
        const projectAsMember = await Project.find({ 'members.username': name });

        if (projectAsMember.length === 0 && projectAsCreater.length === 0) {
            return res.status(403).json({ "error": "Project not found" });
        }

        // If both creator and member projects exist, combine them into one array
        if (projectAsMember.length !== 0 && projectAsCreater.length !== 0) {
            console.log("as both");
            const projects = [...projectAsCreater, ...projectAsMember]; // Combine both arrays
            console.log(projects);
            return res.status(200).json(projects);  // Send the combined array as response
        }
        // If only member projects exist
        else if (projectAsMember.length !== 0) {
            return res.status(200).json(projectAsMember);  // Send member projects
        }
        // If only creator projects exist
        else if (projectAsCreater.length !== 0) {
            return res.status(200).json(projectAsCreater);  // Send creator projects
        } else {
            return res.status(404).json({ "error": "Project not found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ "error": "An error occurred" });
    }
}


//Note : Query Parameters (req.query): Used for optional filtering, sorting, and search criteria 
//(e.g., /search?name=John&age=25), usually optional and part of the URL's query string.
// handle to get a project by name
async function HandleToGetProjectByName(req,res)
{   
    try{
        const name = req.query.name;
        console.log(req.query.name);
        const project = await Project.findOne({projectname : name});

        if(!project)return res.status(404).json({"error" : "project does not exist"});

        const userid = req.user.userData.id;
        // console.log("user: " , req.user.userData.username);
        if(project.createdBy.equals(userid))
        {
            return 
            res.status(200).json({project : project});
        }
        // console.log(project);
        let isMember = false;
        if(project.members.length > 0){
                for(const member of project.members){
                    // console.log(member.username);
                    if(member.username === req.user.userData.username)
                    {
                        isMember = true;
                        break;
                    }
                }
        }
        console.log(isMember);
        if(isMember){
            return res.status(200).json({status : "success",project : project});
        }else{
            return res.status(403).json({"error" : "not found"});
        }
    
    }catch(err){
        console.log(err);
    }
}

async function HandleToDeleteProject(req, res){
    const id  = req.params.id;

    try{
        const project = await Project.findById(id);
        if(!project){
            return res.status(404).json({"error" : "project not found"});
        }

        if(project.createdBy != req.user.userData.id)
        {
            return res.status(403).json({"error" : "you can not delete this project"});
        }

        await Project.deleteOne({_id : id});
        return res.status(200).json({"message" : "project deleted successfully"});
    }
    catch(err){
        console.log(err);
    }
}

// leave project 
async function HandleToLeaveProject(req,res){
    const id  = req.params.id;
    const user = req.user.userData.username;

    try{
        // Find the project by ID and remove the member from the 'members' array
        const project = await Project.findByIdAndUpdate(
            id,
            { $pull: { members: { username: user } } }, // MongoDB pull operation
            { new: true } // To return the updated project
        );

        if(!project){
            return res.status(404).json({"error" : "project not found"});
        }
        res.status(200).json({"success" : `${user} leave project`});

    }catch(err){
        console.log(err);
    }
}

async function HandleTogenerateReport(req, res) {
    try {
        // Get the authenticated user ID from the request (e.g., from JWT token)
        const userId = req.user.userData.id;
        const username = req.user.userData.username;
        console.log("UserID:", userId);

        // Find all projects where the 'createdBy' or any member is the authenticated user
        const projects = await Project.find({
            $or: [
                { createdBy: userId },
                { 'members.username': username }
            ]
        })
            .select('projectname projectStatus startDate DueDate members') // Fetch relevant fields
            .lean(); // Convert to plain JavaScript objects for easier manipulation

        // Log to ensure projects are correctly fetched
        console.log("Projects:", projects);

        if (!projects || projects.length === 0) {
            return res.status(404).json({ error: 'No projects found for this user.' });
        }

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set document metadata (optional)
        doc.info.Title = 'Project Report';
        doc.info.Author = 'Project Management System';

        // Add a header for the document
        doc.fontSize(18).text('Project Report', { align: 'center' });
        doc.moveDown(); // Add some space

        // Add column headers
        doc.fontSize(12).text('Project Name | Status | Start Date | Due Date | Members');
        doc.moveDown(); // Add some space

        // Loop through the projects and add each one to the PDF
        projects.forEach(project => {
            // Check the project details for debugging
            console.log(`Project: ${project.projectname} | Members: ${project.members.map(member => member.username).join(', ')}`);

            const members = project.members.map(member => member.username).join(', ');

            // Write the project information into the PDF
            doc.fontSize(10)
                .text(`${project.projectname}`, { width: 150, continued: true })
                .text(` | ${project.projectStatus}`, { width: 100, continued: true })
                .text(` | ${new Date(project.startDate).toLocaleDateString()}`, { width: 100, continued: true })
                .text(` | ${new Date(project.DueDate).toLocaleDateString()}`, { width: 100, continued: true })
                .text(` | ${members}`, { width: 150 });

            doc.moveDown(); // Move to the next line after each project
        });

        // Add some space at the end for readability
        doc.moveDown();
        doc.text('End of Report');

        // Set up event listener to finalize PDF and then send it to the response
        doc.on('end', () => {
            console.log('PDF generation completed');
        });

        // Set headers for downloading the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="project_report.pdf"');

        // Pipe the PDF to the response
        doc.pipe(res);
        doc.end(); // Finalize the PDF document

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

module.exports = {
    HandleToPostProject,
    HandleToGetProject,
    HandleToGetProjectByName,
    HandleToDeleteProject,
    HandleToLeaveProject,
    HandleTogenerateReport
}



// to find the index of object in members array
/*
const users = [
  { id: 1, username: 'user1' },
  { id: 2, username: 'user2' },
  { id: 3, username: 'user3' }
];

const usernameToFind = 'user2';

const index = users.findIndex(user => user.username === usernameToFind);

console.log(index); // This will output: 1 (since 'user2' is at index 1)

 */