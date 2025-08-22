const express = require('express');
const Reminder = require('../models/Reminder');
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Get calendar events (reminders and diary entries) for a specific month
router.get('/', auth, async (req, res) => {
    try {
        const { year, month } = req.query;
        
        if (!year || !month) {
            return res.status(400).json({ 
                success: false, 
                message: 'Year and month are required' 
            });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get reminders for the month
        const reminders = await Reminder.find({
            userId: req.userId,
            datetime: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ datetime: 1 });

        // Get diary entries for the month
        const diaryEntries = await DiaryEntry.find({
            userId: req.userId,
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ createdAt: 1 });

        // Format events for calendar
        const events = [
            ...reminders.map(reminder => ({
                id: reminder._id,
                type: 'reminder',
                title: reminder.title,
                description: reminder.description,
                date: reminder.datetime,
                color: reminder.color,
                recurring: reminder.recurring,
                completed: reminder.completed
            })),
            ...diaryEntries.map(entry => ({
                id: entry._id,
                type: 'diary',
                title: 'Diary Entry',
                description: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : ''),
                date: entry.createdAt,
                color: '#4CAF50',
                mood: entry.mood
            }))
        ];

        res.json({ 
            success: true, 
            message: 'Calendar events retrieved successfully',
            data: events 
        });
    } catch (error) {
        console.error('❌ Get calendar events error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get events for a specific date
router.get('/date/:date', auth, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        // Get reminders for the date
        const reminders = await Reminder.find({
            userId: req.userId,
            datetime: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ datetime: 1 });

        // Get diary entries for the date
        const diaryEntries = await DiaryEntry.find({
            userId: req.userId,
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({ createdAt: 1 });

        const events = {
            reminders,
            diaryEntries
        };

        res.json({ 
            success: true, 
            message: 'Events for date retrieved successfully',
            data: events 
        });
    } catch (error) {
        console.error('❌ Get events by date error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get upcoming events (next 7 days)
router.get('/upcoming', auth, async (req, res) => {
    try {
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const upcomingReminders = await Reminder.find({
            userId: req.userId,
            datetime: {
                $gte: now,
                $lte: nextWeek
            },
            completed: false
        }).sort({ datetime: 1 }).limit(10);

        res.json({ 
            success: true, 
            message: 'Upcoming events retrieved successfully',
            data: upcomingReminders 
        });
    } catch (error) {
        console.error('❌ Get upcoming events error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a quick reminder from calendar
router.post('/quick-reminder', auth, async (req, res) => {
    try {
        const { title, date, time } = req.body;

        if (!title || !date) {
            return res.status(400).json({ 
                success: false, 
                message: 'Title and date are required' 
            });
        }

        // Combine date and time
        const datetime = new Date(`${date}T${time || '12:00'}`);

        const reminder = new Reminder({
            userId: req.userId,
            title: title.trim(),
            datetime: datetime,
            color: '#ff6b6b'
        });

        await reminder.save();

        res.status(201).json({ 
            success: true, 
            message: 'Quick reminder created successfully',
            data: reminder
        });
    } catch (error) {
        console.error('❌ Create quick reminder error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;