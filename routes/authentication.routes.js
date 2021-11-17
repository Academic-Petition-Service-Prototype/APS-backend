const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

// Database
const db = require('../lib/connectdatabase.js');

// middleware
const verifyToken = require('../middleware/authentication.middleware');
const validateResgister = require('../middleware/validateResgister.middleware');

// http://localhost:3000/api/sign-up
router.post("/sign-up", validateResgister, (req,res,next) => {
    db.query(
    `SELECT id FROM users WHERE LOWER(username) = LOWER(${db.escape(req.body.username)})`, 
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
                    db.query(`INSERT INTO users (id, username, password, status, registered) VALUES ('${uuid.v4()}',${db.escape(req.body.username)},'${hash}',${db.escape(req.body.status)},now());`,(err,result) => {
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
    db.query(`SELECT * FROM users WHERE username = ${db.escape(req.body.username)};`,(err,result) => {
        if(err) {
            throw err;
            return res.status(400).send({
                message: err,
            })
        }
        if(!result.length) {
            return res.status(400).send({
                message: 'Username or password incorrect!'
            })
        }

        bcrypt.compare(req.body.password, result[0]['password'],(bErr, bResult) => {
            if(bErr) {
                throw bErr;
                return res.status(400).send({
                    message: "Username or password incorrect!",
                })
            }
            if(bResult) {
                // password match
                const token = jwt.sign({
                    username: result[0].username,
                    userID: result[0].id,
                }, 
                'SECRETKEY',{
                    expiresIn: "7d"
                });
                db.query(`UPDATE users SET last_login = now() WHERE id = '${result[0].id}';`);
                return res.status(200).send({
                    message: 'Logged in!',
                    token,
                    user:result[0]
                })
            }
            return res.status(401).json({
                message: "Username or password incorrect!"
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