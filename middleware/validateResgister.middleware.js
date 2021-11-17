const validateResgister = (req,res,next) => {
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
}

module.exports = validateResgister;