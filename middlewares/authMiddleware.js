import jwt from 'jsonwebtoken';
import 'express-async-errors';

const userAuth = async(req,res,next) =>{
    const authHeader =req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        next("Auth Failed");
    }

    const token =authHeader.split(' ')[1];
    try {
        const payload =jwt.verify(token,process.env.JWT_SECRET);
        req.user = {userId:payload.userId}
        next();
    } catch (error) {
        next("Auth Failed");
    }
}

export default userAuth;