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
            error: 'Problem reading profile from database!'
        });
    }
};

exports.update = async (req, res) => {
    const { profile, name, email, password, phone, address } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({
                error: 'User not found!'
            });
        }

        if (profile) {
            user.profile = profile;
        }

        if (!name || name.length < 3) {
            return res.status(401).json({
                error: 'Name must be at least 3 characters long!'
            });
        }
        else {
            user.name = name;
        }

        if (email) {
            if (!email || email.length < 6) {
                return res.status(401).json({
                    error: 'Enter a valid email address!'
                });
            }
            user.email = email;
        }

        if (password) {
            if (!password || password.length < 8) {
                return res.status(401).json({
                    error: 'Password must be at least 8 characters long!'
                });
            }
            user.password = password;
        }

        if (phone) {
            if (phone.length < 10) {
                return res.status(401).json({
                    error: 'Enter a valid phone number!'
                });
            }
            user.phone = phone;
        }

        if (address) {
            if (!address || address.length < 6) {
                return res.status(401).json({
                    error: 'Enter a valid location/address!'
                });
            }
            user.address = address;
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
            error: 'Update failed! Please try again.'
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({
                error: 'User not found!'
            });
        }

        const deletedUser = await User.findByIdAndDelete(req.user._id);
        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;

        console.log('DELETE USER SUCCESS:', req.user)
        return res.json(deletedUser);
    }

    catch (err) {
        console.log('DELETE USER FAILED:', err);
        return res.status(500).json({
            error: 'Failed to delete user! Please try again.'
        });
    }
}

exports.lockScreen = async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({
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
            error: 'Problem with unlocking! Please try again.'
        });
    }
}