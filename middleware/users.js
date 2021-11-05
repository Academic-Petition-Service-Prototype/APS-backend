const jwt = require('jsonwebtoken');

module.exports = {
    validateResgister: (req,res,next) => {
        //username min length 4
        if(!req.body.username || req.body.username.length < 4){
            return res.status(400).send({
                message: "Please enter a username with min. 4 chars",
            });
        }
        //password min 6 chars
        if(!req.body.password || req.body.password.length < 6){
            return res.status(400).send({
                message: "Please enter a password with min. 6 chars",
            });
        }
        //password (repeat) must match
        if(!req.body.password_repeat || req.body.password != req.body.password_repeat){
            return res.status(400).send({
                message: "Both passwords must match",
            });
        }
        next();
    },
    isLoggedIn: (req,res,next) => {
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
    },
};