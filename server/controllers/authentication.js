const User = require('../models/User')
const {generateToken,jwtAuthMiddleware} = require('../jwt')
async function HandleToSignUp(req,res){
    const {username,email,password} = req.body;

    // check if user alredy exist
    const user = await User.findOne({username});
    if(user)res.status(409).json({message  : 'User already exists'});

    try{
        const newUser = {username : username, email : email, password : password};
        await User.create(newUser);
        res.status(200).json({message : 'User created'});
    }catch(err){
        console.log(err);
    }
}

async function HandleToLogin(req,res){
      const {name,password} = req.body;
      const user = await User.findOne({username :name})
      if(!user){
        return res.status(401).json({message  : 'Invalid username'});
      }
      if(!(await user.comparepassword(password))){
        return res.status(401).json({message  : 'Invalid password'});
      }
      try{
        const payload = {id : user._id , username :name,password : password};
        const token = generateToken(payload);
        console.log(token);
        res.cookie('authToken', token, {
          httpOnly: true,  // Prevent access to the cookie via JavaScript (helps with XSS protection)
          secure: false,   // Set to `false` in local development since you're not using HTTPS
          maxAge: 3600000,  // Set cookie expiration (1 hour)
          path: '/', 
          samesite:'None', // CSRF protection: allows the cookie to be sent cross-origin (necessary for cross-site requests)
        });
        return res.status(200).json({"message" : "login successful" , "token"  : token})
      }
      catch(err){
          console.log(err);
          res.status(500).json({message  : 'Internal Server Error'});
      }
}

async function HandleToChangePassword(req, res,){
  const {username , changepassword}  = req.body;
  const user = await User.findOne({username : username});

  if(!user)
  {
    return res.status(401).json({message : "Invalid username or password"});
  }

  try{
      user.password = changepassword;
      user.save();
      
      res.json({"message" : "Password changed successfully"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message : "Internal Server Error"});
  }
}

async function handleTologOut(req,res){

    try{
      res.clearCookie('authToken');
      req.user = null;
      res.status(200).json({"message" : "Logged out successfully"});
    }
    catch(err){
      console.log(err);res.status(500).json({message  : 'Internal Server Error'});
    }
}
module.exports = {HandleToSignUp,HandleToLogin,HandleToChangePassword,handleTologOut};