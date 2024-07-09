const User = require('../models/user');

exports.read = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;
        // console.log('LOAD USER PROFILE SUCCESS:', req.user);
        console.log('LOAD USER PROFILE SUCCESS!');
        return res.json(user);
    }

    catch (err) {
        console.log('READ PROFILE FAILED:', err);
        return res.status(500).json({
            error: 'Failed to read profile from database!'
        });
    }
};

exports.update = async (req, res) => {
    const { role, profile, name, email, password, phone, address } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        if (role) {
            if (role !== 'subscriber' || role !== 'admin') {
                return res.status(401).json({
                    error: 'Enter a valid user role!'
                });
            }
            else {
                user.role = role.trim() || user.role;
            }
        }

        if (profile) {
            user.profile = profile.trim() || user.profile;
        }

        if (name && name.length >= 3) {
            user.name = name.trim() || user.name;
        }
        else {
            return res.status(400).json({
                error: 'Name must be at least 3 characters long!'
            });
        }

        // for admins only
        if (email && email.length >= 5) {
            user.email = email.trim() || user.email;
        }
        else {
            return res.status(400).json({
                error: 'Enter a valid email address!'
            });
        }

        if (password && password.length >= 8) {
            user.password = password.trim() || user.password;
        }
        else {
            return res.status(400).json({
                error: 'Password must be at least 8 characters long!'
            });
        }

        if (phone && phone.length >= 10) {
            user.phone = phone.trim() || user.phone;
        }
        else if (phone !== undefined) {
            user.phone = '';
        }
        else {
            return res.status(400).json({
                error: 'Enter a valid phone number!'
            });
        }

        if (address && address.length >= 3) {
            user.address = address.trim() || user.address;
        }
        else if (address !== undefined) {
            user.address = '';
        }
        else {
            return res.status(400).json({
                error: 'Enter a valid address!'
            });
        }

        const updatedUser = await user.save();
        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;

        // console.log('UPDATE USER SUCCESS:', req.user);
        console.log('UPDATE USER SUCCESS!');
        return res.json(updatedUser);
    }

    catch (err) {
        console.log('UPDATE USER FAILED:', err);
        return res.status(500).json({
            error: 'Failed to update user! Please try again.'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        user.hashed_password = undefined;
        user.salt = undefined;

        console.log('DELETE USER SUCCESS:', req.user)
        return res.json(user);
    }

    catch (err) {
        console.log('DELETE USER FAILED:', err);
        return res.status(500).json({
            error: 'Failed to delete user! Please try again.'
        });
    }
}

exports.lockscreen = async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                error: 'User not found!'
            });
        }

        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Incorrect password! Please try again.'
            });
        }

        return res.json({
            message: `Screen unlocked successfully!`
        });
    }

    catch (err) {
        console.log('UNLOCK USER ERROR:', err);
        return res.status(500).json({
            error: 'Failed to unlock screen! Please try again.'
        });
    }
}

exports.fetchUsers = async (req, res) => {
    try {
        const users = await User.find();

        console.log('READ USERS SUCCESS!');
        return res.json(users);
    }

    catch (err) {
        console.log('READ USERS FAILED:', err);
        return res.status(500).json({
            message: 'Failed to fetch users from database!'
        });
    }
};

exports.countActive = async (req, res) => {
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