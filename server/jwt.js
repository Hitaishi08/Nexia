const jwt = require('jsonwebtoken');
require('dotenv').config()
const jwtAuthMiddleware = (req,res,next) => {
    // const authorization = req.headers.authorization;

    // if(!authorization)return res.status(404).json({"error" : "token not found"});

    // const token = authorization.split(' ')[1];
    const token = req.cookies.authToken;
    // if(!token)return res.status(404).json({"error" : "unauthorized"});

    try{
        const secretKey = "123Hitaishi$secret@key#projectManagement";
        const decode = jwt.verify(token,secretKey);

        req.user = decode;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({error : 'Invalid token'});
    }
}

const generateToken = (userData) => {
    const secretKey = "123Hitaishi$secret@key#projectManagement";
    return jwt.sign({userData},secretKey);
}

module.exports = {jwtAuthMiddleware,generateToken};