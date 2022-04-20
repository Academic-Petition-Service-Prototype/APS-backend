const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Database
const db = require('../lib/connectdatabase.js');

// middleware
const verifyToken = require('../middleware/authentication.middleware');
const validateResgister = require('../middleware/validateResgister.middleware');

// http://localhost:3000/api/sign-up
router.post("/sign-up", validateResgister, (req,res,next) => {
    db.query(
    `SELECT user_id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})`, 
    (err, result) => {
        if(result && result.length) { 
            //error
            return res.status(409).send({
                message: 'This username is already in use!'
            });
        } else { //username not in use
            bcrypt.hash(req.body.password, 10, (err,hash) => {
                if(err) {
                    throw err;
                    return res.status(500).send({
                        message: err,
                    });
                } else {
                    db.query(`INSERT INTO users (email, password, status, registered, agency) VALUES (${db.escape(req.body.email)},'${hash}',${db.escape(req.body.status)},now(),${db.escape(req.body.agency)});`,(err,result) => {
                        if(err){
                            throw err;
                            return res.status(400).send({
                                message:err,
                            });
                        }
                        return res.status(201).send({
                            message: "Registered!",
                        })
                    });
                }
            });
        }
    });
});

// http://localhost:3000/api/login
router.post("/login",(req,res,next) => {
    // db.query(`SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,(err,result) => {
        db.query(`SELECT *
        FROM users
        FULL JOIN agency
        ON agencies_id = agency.agency_id	
        WHERE email = ${db.escape(req.body.email)};`,(err,result) => {
        if(err) {
            throw err;
            return res.status(400).send({
                message: err,
            })
        }
        if(!result.length) {
            return res.status(400).send({
                message: 'Email or Password incorrect!'
            })
        }

        bcrypt.compare(req.body.password, result[0]['password'],(bErr, bResult) => {
            if(bErr) {
                throw bErr;
                return res.status(400).send({
                    message: "Email or Password incorrect!",
                })
            }
            if(bResult) {
                // password match
                const token = jwt.sign({
                    email: result[0].email,
                    userID: result[0].user_id,
                }, 
                'SECRETKEY',{
                    expiresIn: "7d"
                });
                db.query(`UPDATE users SET last_login = now() WHERE user_id = '${result[0].user_id}';`);
                return res.status(200).send({
                    message: 'Logged in!',
                    token,
                    user:result[0]
                })
            }
            return res.status(401).json({
                message: "Email or Password incorrect!"
            })
        });
    });
});

// http://localhost:3000/api/secret-route
router.get("/secret-route",verifyToken,(req,res,next) => {
    console.log(req.userData);
    res.send("This is secret content!");
})

module.exports = router;