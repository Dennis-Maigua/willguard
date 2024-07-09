const User = require('../models/user');

exports.read = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({
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
            return res.status(401).json({
                error: 'User not found!'
            });
        }

        if (role) {
            if (role !== 'subscriber' || role !== 'admin') {
                return res.status(401).json({
                    error: 'Invalid user role!'
                });
            }
            user.role = role.trim();
        }

        if (profile) {
            user.profile = profile.trim();
        }

        if (name && name.length >= 3) {
            user.name = name.trim();
        }
        else {
            return res.status(400).json({
                error: 'Name must be at least 3 characters long!'
            });
        }

        // for admins only
        if (email) {
            if (email.length < 5) {
                return res.status(400).json({
                    error: 'Enter a valid email address!'
                });
            }
            user.email = email.trim();
        }

        if (password) {
            if (password.length < 8) {
                return res.status(400).json({
                    error: 'Password must be at least 8 characters long!'
                });
            }
            user.password = password.trim();
        }

        if (phone) {
            if (phone.length < 10) {
                return res.status(400).json({
                    error: 'Enter a valid phone number!'
                });
            }
            else if (phone !== undefined) {
                user.phone = '';
            }
            user.phone = phone.trim();
        }

        if (address) {
            if (address.length < 3) {
                return res.status(400).json({
                    error: 'Enter a valid address!'
                });
            }
            else if (address !== undefined) {
                user.address = '';
            }
            user.address = address.trim();
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