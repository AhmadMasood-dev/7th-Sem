const Task = require('../models/task.js');

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  try {
    const { title, description = '', status = 'pending' } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const newTask = new Task({ title, description, status });
    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
