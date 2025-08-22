const express = require('express');
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all diary entries for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const entries = await DiaryEntry.find({ userId: req.userId })
            .sort({ createdAt: -1 });
        
        res.json({ 
            success: true, 
            message: 'Diary entries retrieved successfully',
            data: entries 
        });
    } catch (error) {
        console.error('❌ Get diary entries error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create a new diary entry
router.post('/', auth, async (req, res) => {
    try {
        const { content, mood, tags } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Content is required' 
            });
        }

        const entry = new DiaryEntry({
            userId: req.userId,
            content: content.trim(),
            mood: mood || 'neutral',
            tags: tags || []
        });

        await entry.save();

        res.status(201).json({ 
            success: true, 
            message: 'Diary entry created successfully',
            data: entry
        });
    } catch (error) {
        console.error('❌ Create diary entry error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get a specific diary entry
router.get('/:id', auth, async (req, res) => {
    try {
        const entry = await DiaryEntry.findOne({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!entry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Diary entry not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Diary entry retrieved successfully',
            data: entry 
        });
    } catch (error) {
        console.error('❌ Get diary entry error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update a diary entry
router.put('/:id', auth, async (req, res) => {
    try {
        const { content, mood, tags } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Content is required' 
            });
        }

        const entry = await DiaryEntry.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { 
                content: content.trim(),
                mood: mood || 'neutral',
                tags: tags || []
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Diary entry not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Diary entry updated successfully',
            data: entry 
        });
    } catch (error) {
        console.error('❌ Update diary entry error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete a diary entry
router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await DiaryEntry.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.userId 
        });

        if (!entry) {
            return res.status(404).json({ 
                success: false, 
                message: 'Diary entry not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Diary entry deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete diary entry error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;