import User from '../models/userSchema.js';

export const registerController = async (req, res, next) => {
    const { name, email, password } = req.body;

    // validate
    if (!name) {
        next("Name is Required!");
    }

    if (!password) {
        next("Password is Required!");
    }

    if (!email) {
        next("Email Required!");
    }

    // Check is user Already exists or not
    const isexists = await User.findOne({ email });
    // if exists
    if (isexists) {
        next("Email already Exists! Please Login");
    }

    // else create user
    const user = await User.create({ name, password, email });
    // token
    const token = user.createJWT();
    res.status(201).json({
        message: "User Created Successfully!",
        success: true,
        user: {
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            location: user.location
        },
        token
    });
};


export const loginController = async (req, res,next) => {
    const { email, password } = req.body;
    // validation 
    if (!email || !password) {
        next("All Fields are Required!")
    }
    // find user by email id
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        next("Invalid Username or Password!");
    }
    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        next("Invalid Username or Password!");
    }

    const token = user.createJWT();
    user.password=undefined;
    res.status(200).json({
        success: true,
        message: 'Login Successfully!',
        user,
        token
    })
}