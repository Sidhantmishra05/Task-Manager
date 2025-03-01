const Task = require('../models/Task');

// Get All Tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.log("Error in get All Task",err.message);
        res.status(500).json({ message: err.message });
    }
};

// Get Single Task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const newTask = new Task({ title, description, status });
        await newTask.save();
        res.status(201).json({
            _id: newTask._id,
            title:newTask.title,
            description:newTask.description
        });
    } catch (error) {
        console.log("Error in Create Task controller",error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

// Update Task
// exports.updateTask = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) return res.status(404).json({ message: "Task not found" });

//         task.title = req.body.title || task.title;
//         task.description = req.body.description || task.description;
//         task.status = req.body.status || task.status;

//         const updatedTask = await task.save();
//         res.json(updatedTask);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };
// Update Task
exports.updateTask = async (req, res) => {
    try {
        console.log(" Received PUT request:", req.body);

        const task = await Task.findById(req.params.id);
        if (!task) {
            console.log(" Task not found in DB.");
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.status = req.body.status || task.status;

        const updatedTask = await task.save();
        console.log(" Task updated successfully:", updatedTask);

        res.json(updatedTask);
    } catch (err) {
        console.error(" Error updating task:", err.message);
        res.status(400).json({ message: err.message });
    }
};


// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await task.deleteOne();
        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
