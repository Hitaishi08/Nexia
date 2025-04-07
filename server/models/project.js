const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectname: {
        type : String,
        required : true,
    },
    projectdescription: {
        type :String,
        required : true,
    },
    projectStatus :{
        type : String,
        enum : ['ongoing','completed','pending'],
        default : 'ongoing'
    },
    members :[
        {
            username : {
            type : String,
            required : true,
            },
            role :{
                type : String,
                required : true,
                enum : ['projectManager','developer'],
                default :'developer'
            }
        },
    ],
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    role :  {
        type : String,
        enum : ['projectManager','developer'],
        default : 'projectManager'
    },
    startDate : {
        type : Date,
        required : true,
    },
    DueDate : {
        type : Date,
        required : true,
    }
});

const Project = new mongoose.model('Project',ProjectSchema);
module.exports = Project;