const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate JWT Token
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// LOGIN - Validate existing users only
router.post('/login', async (req, res) => {
    console.log('🚀 LOGIN route hit');
    console.log('📦 Request body:', req.body);

    try {
        const { username, password } = req.body;
        const usernameNorm = (username || '').toLowerCase().trim();
        const passwordNorm = (password || '').trim();
        console.log(`👤 Username (raw): ${username} -> (norm): ${usernameNorm}, 🔑 Password length: ${password ? password.length : 'undefined'}`);

        // Validation
        console.log('🔍 Validating login fields...');
        if (!usernameNorm || !passwordNorm) {
            console.log('❌ Missing username or password');
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }
        console.log('✅ Login validation passed');

        // Find user in database
        console.log(`🔍 Looking for user with username: ${usernameNorm}`);
        const user = await User.findOne({ username: usernameNorm });
        if (!user) {
            console.log(`❌ User not found for username: ${usernameNorm}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        console.log(`✅ User found: ${user.username}, ID: ${user._id}`);
        console.log(`🔐 Stored password hash length: ${user.password ? user.password.length : 'undefined'}`);
        console.log(`🔑 Provided password length: ${passwordNorm ? passwordNorm.length : 'undefined'}`);

        // Verify password (supports plaintext only if hashing is disabled, otherwise bcrypt)
        let isPasswordValid = false;
        if (process.env.DISABLE_PASSWORD_HASHING === 'true' || !/^\$2[aby]?\$/.test(user.password || '')) {
            isPasswordValid = (passwordNorm === user.password);
            console.log(`🔧 Plaintext compare mode: ${isPasswordValid}`);
        } else {
            isPasswordValid = await bcrypt.compare(passwordNorm, user.password);
            console.log(`🔐 Bcrypt compare mode: ${isPasswordValid}`);
        }

        if (!isPasswordValid) {
            console.log(`❌ Password validation failed for user: ${user.username}`);
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        console.log(`✅ Login successful for user: ${user.username}`);

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

        console.log('✅ User logged in successfully:', user.username);

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

// ADMIN DEBUG: Verify user credentials are stored (SAFE: no plaintext password is returned)
// Call with header: X-Admin-Diag: <token set in ADMIN_DIAG_TOKEN env>
router.get('/__diag__/user', async (req, res) => {
    try {
        const diagHeader = req.header('X-Admin-Diag');
        if (!process.env.ADMIN_DIAG_TOKEN || diagHeader !== process.env.ADMIN_DIAG_TOKEN) {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, message: 'email query param required' });
        }
        const emailNorm = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: emailNorm });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const looksHashed = /^\$2[aby]?\$/.test(user.password || '');
        return res.json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                name: user.name,
                createdAt: user.createdAt,
            },
            passwordInfo: {
                present: Boolean(user.password),
                length: user.password ? user.password.length : 0,
                looksHashed,
                hashingDisabled: process.env.DISABLE_PASSWORD_HASHING === 'true'
            }
        });
    } catch (err) {
        console.error('Diag error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

    // Since we're using JWT, logout is handled client-side by removing the token
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// TEMPORARY ADMIN ENDPOINT: Remove all users (REMOVE AFTER USE)
router.delete('/__admin__/clear-all-users', async (req, res) => {
    try {
        const adminToken = req.header('X-Admin-Token');
        const expectedToken = process.env.ADMIN_CLEANUP_TOKEN || 'cleanup-2024';
        
        if (adminToken !== expectedToken) {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin token required',
                hint: 'Set X-Admin-Token header to: ' + expectedToken
            });
        }

        console.log('🗑️  ADMIN: Clearing all users from database...');
        
        // Get count before deletion
        const userCount = await User.countDocuments();
        console.log(`📊 Found ${userCount} users to delete`);

        if (userCount === 0) {
            return res.json({
                success: true,
                message: 'No users to delete',
                deletedCount: 0
            });
        }

        // Delete all users
        const result = await User.deleteMany({});
        
        console.log(`✅ ADMIN: Deleted ${result.deletedCount} users successfully`);

        res.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} users`,
            deletedCount: result.deletedCount,
            warning: 'REMEMBER TO REMOVE THIS ENDPOINT AFTER USE!'
        });

    } catch (error) {
        console.error('❌ ADMIN: Error clearing users:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to clear users',
            details: error.message
        });
    }
});

module.exports = router;
