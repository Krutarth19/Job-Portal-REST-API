import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is Required!"]
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "Email is Required!"],
        unique: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minlength: [2, "Password Length Should Be Greater Than 2"],
        select:true
    },
    location: {
        type: String,
        default: "India",
    }
}, { timestamps: true });

// middleware
userSchema.pre("save", async function () {
    if(!this.isModified) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// compare password
userSchema.methods.comparePassword =async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password);
    return isMatch;
}

// JsonWebToken
userSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}


export default mongoose.model("User", userSchema);