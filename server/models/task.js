const { model } = require("mongoose");

const mongoose = required('mongoose');

const TaskSchema = new mongoose.Schema({
    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },
    taskname  :{
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true
    },
    taskStatus :{
        type : String,
        required : true,
        enum : ['to-do','progress','complete'],
        default : 'to-do'
    },
    createdBy :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    assignto : {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    dueDate :{
        type : Date,
        required : true,
        validate: [(value) => value >= new Date(), 'Due date must be a future date']
    }
});

const Task = new mongoose.model('Task',TaskSchema);
model.exports = Task;