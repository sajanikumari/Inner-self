const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
};

// LOGIN - Validate existing users only
router.post('/login', async (req, res) => {
    console.log('🚀 LOGIN route hit');
    console.log('📦 Request body:', req.body);

    try {
        const { email, password } = req.body;
        console.log(`📧 Email: ${email}, 🔑 Password length: ${password ? password.length : 'undefined'}`);

        // Validation
        console.log('🔍 Validating login fields...');
        if (!email || !password) {
            console.log('❌ Missing email or password');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        console.log('✅ Login validation passed');

        // Find user in database
        console.log(`🔍 Looking for user with email: ${email.toLowerCase()}`);
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log(`❌ User not found for email: ${email.toLowerCase()}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log(`✅ User found: ${user.email}, ID: ${user._id}`);
        console.log(`🔐 Stored password hash length: ${user.password ? user.password.length : 'undefined'}`);
        console.log(`🔑 Provided password length: ${password ? password.length : 'undefined'}`);

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`🔓 Password validation result: ${isPasswordValid}`);

        if (!isPasswordValid) {
            console.log(`❌ Password validation failed for user: ${user.email}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        console.log(`✅ Login successful for user: ${user.email}`);

        // Generate token
        const token = generateToken(user._id);

        // Return user data (without password)
        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        };

        console.log('✅ User logged in successfully:', user.email);
        
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// SIGNUP - Create new user account
router.post('/signup', async (req, res) => {
    console.log('🚀 SIGNUP route hit');
    console.log('📦 Request body:', req.body);

    try {
        const { name, username, email, password } = req.body;
        console.log(`📧 Email: ${email}, 🔑 Password length: ${password ? password.length : 'undefined'}`);

        // Validation
        console.log('🔍 Validating signup fields...');
        if (!name || !username || !email || !password) {
            console.log('❌ Missing required fields:', { name: !!name, username: !!username, email: !!email, password: !!password });
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        console.log('✅ Signup validation passed');

        if (password.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            const field = existingUser.email === email.toLowerCase() ? 'email' : 'username';
            return res.status(400).json({ 
                success: false, 
                message: `User with this ${field} already exists` 
            });
        }

        // Create new user (password will be hashed automatically by the model)
        console.log(`🔄 Creating new user: ${email.toLowerCase()}`);
        console.log(`🔑 Original password length: ${password.length}`);

        // Create user with raw password; model pre-save hook will hash it
        const user = new User({
            name: name.trim(),
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: password
        });

        await user.save();

        console.log(`✅ User created successfully: ${user.email}`);
        console.log(`🔐 Hashed password length: ${user.password ? user.password.length : 'undefined'}`);

        // Generate token
        const token = generateToken(user._id);

        // Return user data (without password)
        const userData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            bio: user.bio
        };

        console.log('✅ New user registered:', user.email);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: userData
        });

    } catch (error) {
        console.error('❌ Signup error:', error);
        if (error.code === 11000) {
            // Duplicate key error
            res.status(400).json({ 
                success: false, 
                message: 'Email or username already exists' 
            });
        } else {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
});

// GET USER INFO - Protected route
router.get('/me', auth, async (req, res) => {
    try {
        // User info is attached by auth middleware
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ 
            success: true, 
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio
            }
        });
    } catch (error) {
        console.error('❌ Get user error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// UPDATE PROFILE - Protected route
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, username, email, bio, avatar } = req.body;
        
        // Find and update user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name.trim();
        if (username) user.username = username.toLowerCase().trim();
        if (email) user.email = email.toLowerCase().trim();
        if (bio !== undefined) user.bio = bio.trim();
        if (avatar) user.avatar = avatar;

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
            user: userData
        });

    } catch (error) {
        console.error('❌ Update profile error:', error);
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false, 
                message: 'Email or username already exists' 
            });
        } else {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
});

// CHANGE PASSWORD - Protected route
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password must be at least 6 characters long' 
            });
        }

        // Find user
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Current password is incorrect' 
            });
        }

        // Update password (will be hashed by the model)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('❌ Change password error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// LOGOUT
router.post('/logout', (req, res) => {
    // Since we're using JWT, logout is handled client-side by removing the token
    res.json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
});

module.exports = router;