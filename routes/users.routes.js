const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all users
router.get('/users',(req, res) => {
    db.query('SELECT * FROM users',(err, rows, fields) => {
        console.log(rows);

        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get users by id
router.get('/users/:id',(req, res) => {
    let id = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('User not found with id = ' + id)
        } else {
            res.send(rows);
        }
    })
})

//update users by id
router.post('/users/:id', (req, res, next) => {
    let id = req.params.id;
    let email = req.body.email;
    let password = req.body.password;
    let status = req.body.status;
    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let tel_num = req.body.tel_num;
    let gender = req.body.gender;
    let group_id = req.body.group_id;
    let errors = false;

    if (username.length === 0 || password.length === 0){
        errors = true;
        res.send('error','Please fill your information');
        
    }

    if(!errors){
        let form_data = {
            email : email,
            password: password,
            status : status,
            f_name : f_name,
            l_name: l_name,
            tel_num : tel_num,
            gender : gender,
            group_id : group_id
        }
        // update query
        db.query('UPDATE users SET ? WHERE id = ' + id, form_data, (err,result) => {
            if (err) {
                res.send('Update Error!', err);
            } else {
                res.send('Update Success!');

            }
        })
    }
})

// Delete users by id
router.delete('/users/:id',(req, res) => {
    db.query('DELETE FROM users WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('Deleted user successful');
        } else {
            console.log(err)
        }
    })
})

// Insert users
router.post('/users',(req, res) => {
    db.query(`SELECT id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})`, (err, result) => {
        if(result && result.length) { 
            //error
            return res.status(409).send({
                message: 'อีเมลล์นี้มีอยู่ในระบบแล้ว'
            });
        } else { //email not in use
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
                            message: "เพิ่มผู้ใช้งานสำเร็จ",
                        })
                    });
                }
            });
        }
    });
})

module.exports = router;