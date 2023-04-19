import User from '../models/userSchema.js';

export const updateUser = async (req, res, next) => {
    const { name, email, lastName, location } = req.body;
    if (!name || !email || !lastName || !location) {
        next("Please enter all fields!");
    }

    const user = await User.findOne({ _id: req.user.userId });
    user.name =name;
    user.email =email;
    user.lastName =lastName;
    user.location =location;

    await user.save()
    const token =user.createJWT();
    res.status(200).json({
        user,
        token
    })

}