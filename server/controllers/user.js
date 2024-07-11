const User = require('../models/user');

exports.loadProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        console.log('LOAD PROFILE SUCCESS:', req.user);
        return res.json(user);
    }

    catch (err) {
        console.log('LOAD PROFILE FAILED:', err);
        return res.status(500).json({
            error: 'Failed to read profile from database!'
        });
    }
};

exports.updateProfile = async (req, res) => {
    const { role, profileUrl, name, email, password, phone, address } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        if (role) {
            user.role = role.trim();
        }

        if (profileUrl) {
            user.profileUrl = profileUrl.trim();
        }

        if (name) {
            user.name = name.trim();
        }

        // for admins only
        if (email) {
            user.email = email.trim();
        }

        if (password !== undefined) {
            user.password = password.trim();
        }

        if (phone !== undefined) {
            user.phone = phone.trim();
        }

        if (address !== undefined) {
            user.address = address.trim();
        }

        const updatedUser = await user.save();
        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;

        console.log('UPDATE PROFILE SUCCESS:', req.user);
        return res.json({
            success: true,
            message: `User profile updated successfully!`,
            updatedUser
        });
    }

    catch (err) {
        console.log('UPDATE PROFILE FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update profile! Please try again.'
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        console.log('DELETE ACCOUNT SUCCESS:', req.user)
        return res.json({
            success: true,
            message: `Account deleted successfully!`,
            user
        });
    }

    catch (err) {
        console.log('DELETE ACCOUNT FAILED:', err);
        return res.status(500).json({
            error: 'Failed to delete account! Please try again.'
        });
    }
}

exports.fetchUsers = async (req, res) => {
    try {
        const users = await User.find();

        console.log('FETCH USERS SUCCESS!');
        return res.json(users);
    }

    catch (err) {
        console.log('FETCH USERS FAILED:', err);
        return res.status(500).json({
            message: 'Failed to fetch users from database!'
        });
    }
};

exports.activeUsers = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const activeUsers = await User.countDocuments({ lastLogin: { $gte: thirtyDaysAgo } });
        return res.json({
            active: activeUsers
        });
    }

    catch (err) {
        console.log('COUNT ACTIVE USERS FAILED:', err);
        return res.status(500).json({ error: 'Failed to count active users!' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.body._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        console.log('DELETE USER SUCCESS:', req.user)
        return res.json({
            success: true,
            message: `User deleted successfully!`,
            user
        });
    }

    catch (err) {
        console.log('DELETE USER FAILED:', err);
        return res.status(500).json({
            error: 'Failed to delete user! Please try again.'
        });
    }
}