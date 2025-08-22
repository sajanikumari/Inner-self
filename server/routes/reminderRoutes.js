const express = require('express');
const Reminder = require('../models/Reminder');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all reminders for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const reminders = await Reminder.find({ userId: req.userId })
            .sort({ datetime: 1 });
        
        res.json({ 
            success: true, 
            message: 'Reminders retrieved successfully',
            data: reminders 
        });
    } catch (error) {
        console.error('❌ Get reminders error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new reminder
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, datetime, preAlert, color, recurring } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Title is required' 
            });
        }

        if (!datetime) {
            return res.status(400).json({ 
                success: false, 
                message: 'Date and time are required' 
            });
        }

        const reminder = new Reminder({
            userId: req.userId,
            title: title.trim(),
            description: description || '',
            datetime: new Date(datetime),
            preAlert: preAlert || 15,
            color: color || '#ff6b6b',
            recurring: recurring || 'none'
        });

        await reminder.save();

        res.status(201).json({ 
            success: true, 
            message: 'Reminder created successfully',
            data: reminder
        });
    } catch (error) {
        console.error('❌ Create reminder error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get a specific reminder
router.get('/:id', auth, async (req, res) => {
    try {
        const reminder = await Reminder.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!reminder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Reminder not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Reminder retrieved successfully',
            data: reminder 
        });
    } catch (error) {
        console.error('❌ Get reminder error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a reminder
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, description, datetime, preAlert, color, recurring, completed } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description;
        if (datetime !== undefined) updateData.datetime = new Date(datetime);
        if (preAlert !== undefined) updateData.preAlert = preAlert;
        if (color !== undefined) updateData.color = color;
        if (recurring !== undefined) updateData.recurring = recurring;
        if (completed !== undefined) updateData.completed = completed;

        const reminder = await Reminder.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updateData,
            { new: true }
        );

        if (!reminder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Reminder not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Reminder updated successfully',
            data: reminder 
        });
    } catch (error) {
        console.error('❌ Update reminder error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a reminder
router.delete('/:id', auth, async (req, res) => {
    try {
        const reminder = await Reminder.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!reminder) {
            return res.status(404).json({ 
                success: false, 
                message: 'Reminder not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Reminder deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete reminder error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get reminders for a specific date range (for calendar view)
router.get('/range/:start/:end', auth, async (req, res) => {
    try {
        const startDate = new Date(req.params.start);
        const endDate = new Date(req.params.end);

        const reminders = await Reminder.find({
            userId: req.userId,
            datetime: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ datetime: 1 });

        res.json({ 
            success: true, 
            message: 'Reminders for date range retrieved successfully',
            data: reminders 
        });
    } catch (error) {
        console.error('❌ Get reminders by date range error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;