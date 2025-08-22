const express = require('express');
const Setting = require('../models/setting');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user settings
router.get('/', auth, async (req, res) => {
    try {
        let settings = await Setting.findOne({ userId: req.userId });
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = new Setting({ userId: req.userId });
            await settings.save();
        }

        res.json({ 
            success: true, 
            message: 'Settings retrieved successfully',
            data: settings 
        });
    } catch (error) {
        console.error('❌ Get settings error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update user settings
router.put('/', auth, async (req, res) => {
    try {
        const { theme, notifications, privacy, preferences } = req.body;

        const updateData = {};
        if (theme !== undefined) updateData.theme = theme;
        if (notifications !== undefined) updateData.notifications = notifications;
        if (privacy !== undefined) updateData.privacy = privacy;
        if (preferences !== undefined) updateData.preferences = preferences;

        let settings = await Setting.findOneAndUpdate(
            { userId: req.userId },
            updateData,
            { new: true, upsert: true }
        );

        res.json({ 
            success: true, 
            message: 'Settings updated successfully',
            data: settings 
        });
    } catch (error) {
        console.error('❌ Update settings error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update user profile (separate from auth routes for settings page)
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, email, bio, avatar } = req.body;
        
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields if provided
        if (name !== undefined) user.name = name.trim();
        if (email !== undefined) user.email = email.toLowerCase().trim();
        if (bio !== undefined) user.bio = bio.trim();
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        };

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: userData
        });

    } catch (error) {
        console.error('❌ Update profile error:', error);
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false, 
                message: 'Email already exists' 
            });
        } else {
            res.status(500).json({ success: false, error: error.message });
        }
    }
});

// Delete user account
router.delete('/account', auth, async (req, res) => {
    try {
        // Delete user's data
        await Promise.all([
            User.findByIdAndDelete(req.userId),
            Setting.findOneAndDelete({ userId: req.userId }),
            // Add other models as needed
            require('../models/DiaryEntry').deleteMany({ userId: req.userId }),
            require('../models/Task').deleteMany({ userId: req.userId }),
            require('../models/Reminder').deleteMany({ userId: req.userId })
        ]);

        res.json({ 
            success: true, 
            message: 'Account deleted successfully' 
        });
    } catch (error) {
        console.error('❌ Delete account error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Export user data
router.get('/export', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        const settings = await Setting.findOne({ userId: req.userId });
        const DiaryEntry = require('../models/DiaryEntry');
        const Task = require('../models/Task');
        const Reminder = require('../models/Reminder');
        
        const [diaryEntries, tasks, reminders] = await Promise.all([
            DiaryEntry.find({ userId: req.userId }),
            Task.find({ userId: req.userId }),
            Reminder.find({ userId: req.userId })
        ]);

        const exportData = {
            user,
            settings,
            diaryEntries,
            tasks,
            reminders,
            exportDate: new Date().toISOString()
        };

        res.json({ 
            success: true, 
            message: 'Data exported successfully',
            data: exportData 
        });
    } catch (error) {
        console.error('❌ Export data error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;