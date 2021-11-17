const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {
    if(!req.headers.authorization){
        return res.status(400).send({
            message: "Your session is not valid",
        })
    }
    try{
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoed = jwt.verify(token,'SECRETKEY');
        req.userData = decoed;
        next();
    } catch(err){
        throw err;
        return res.status(400).send({
            message: "Your session is not valid",
        });
    }
}

module.exports = verifyToken;