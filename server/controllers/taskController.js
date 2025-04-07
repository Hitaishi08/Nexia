const User = require('../models/user');
const task = require('../models/task');
const Project = require('../models/project');
const express = require('express');


const HandleToCreateTask = async (req, res, next) => {
    try{
    const { taskname, description,taskStatus,assignto, dueDate} = req.body;
    if(!taskname || !description ||  !taskStatus || !dueDate || !assignto)return res.status().json({"error" : "please provide full info"});

    const userId = req.user.userData.id;

    const user = await User.findById(userId);
    if(!user)return res.status(403).json({"error" : "unauthorized"});

    const assigntoid = await User.find({username: assignto});
    if(!assigntoid)return res.status(403).json({"error" : "user does not exist"});

    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if(!project)return res.status(404).json({"error" : "project not found"});

    const newTask = new task({
        project: projectId,
        taskname,
        description,
        taskStatus,
        createdBy: userId,
        assignto : assigntoid,
        dueDate
    });

    await newTask.save();
    res.status(200).json({"message" : "task created successfully"});
}catch(err) {
    console.log(err);
    res.status(500).json({"error" : "internal server error", "err" : err.message});
}
}


const HandleToUpdateTask = async (req, res, next) => {
    try{
        
    }catch(err){
        console.log(err);
        res.status(500).json({"error" : "internal server error", "err" : err.message});
    }
}
