const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId })
            .sort({ order: 1, createdAt: -1 });
        
        res.json({ 
            success: true, 
            message: 'Tasks retrieved successfully',
            data: tasks 
        });
    } catch (error) {
        console.error('❌ Get tasks error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new task
router.post('/', auth, async (req, res) => {
    try {
        const { text, time, icon } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Task text is required' 
            });
        }

        // Get the highest order number for this user
        const lastTask = await Task.findOne({ userId: req.userId })
            .sort({ order: -1 });
        
        const nextOrder = lastTask ? lastTask.order + 1 : 0;

        const task = new Task({
            userId: req.userId,
            text: text.trim(),
            time: time || '',
            icon: icon || 'fas fa-circle',
            order: nextOrder
        });

        await task.save();

        res.status(201).json({ 
            success: true, 
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        console.error('❌ Create task error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
    try {
        const { text, time, icon, completed } = req.body;

        const updateData = {};
        if (text !== undefined) updateData.text = text.trim();
        if (time !== undefined) updateData.time = time;
        if (icon !== undefined) updateData.icon = icon;
        if (completed !== undefined) updateData.completed = completed;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Task updated successfully',
            data: task 
        });
    } catch (error) {
        console.error('❌ Update task error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!task) {
            return res.status(404).json({ 
                success: false, 
                message: 'Task not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Task deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete task error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reorder tasks
router.put('/reorder', auth, async (req, res) => {
    try {
        const { taskIds } = req.body;

        if (!Array.isArray(taskIds)) {
            return res.status(400).json({ 
                success: false, 
                message: 'taskIds must be an array' 
            });
        }

        // Update the order of each task
        const updatePromises = taskIds.map((taskId, index) => 
            Task.findOneAndUpdate(
                { _id: taskId, userId: req.userId },
                { order: index },
                { new: true }
            )
        );

        const updatedTasks = await Promise.all(updatePromises);

        res.json({ 
            success: true, 
            message: 'Tasks reordered successfully',
            data: updatedTasks.filter(task => task !== null)
        });
    } catch (error) {
        console.error('❌ Reorder tasks error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;