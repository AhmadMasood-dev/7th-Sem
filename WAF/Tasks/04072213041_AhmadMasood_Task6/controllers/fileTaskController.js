const { readTasks, writeTasks } = require('../fileStorage.js');

exports.getAllTasks = async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const tasks = await readTasks();

  const { title, description = '', status = 'pending' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    status,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  await writeTasks(tasks);
  res.status(201).json(newTask);
};
