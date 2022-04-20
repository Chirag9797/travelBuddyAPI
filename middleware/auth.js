const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    // Get the token

    const token = req.header('x-auth-token');

    // Check if not token
    console.log(token)
    if(!token){
        return res.status(401).json({msg:"No token, auth denied"})
    }

    try{
        const decode = jwt.verify(token, config.get('jwtSecret'));
        console.log('token',decode)
        req.email = decode.user;
        next();
    } catch(err){
        res.status(401).json({msg:'Token is not valid'})
    }

}