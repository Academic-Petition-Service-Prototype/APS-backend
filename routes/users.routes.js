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
    db.query('SELECT * FROM users WHERE user_id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('ไม่พบผู้ใช้งานหมายเลข'+id+'ในฐานข้อมูล')
        } else {
            res.send(rows);
        }
    })
})

// Get chief by id
router.get('/getchief/:id',(req, res) => {
    let id = req.params.id;
    console.log(req.params.id)
    db.query(`SELECT  f_name, l_name FROM users WHERE agencies_id = ? AND role = 'chief'`,[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('ไม่พบ chief')
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
    let role = req.body.role;
    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let tel_num = req.body.tel_num;
    let gender = req.body.gender;
    let address = req.body.address;
    let img = req.body.img;
    let agencies_id = req.body.agencies_id;
    let errors = false;

    if (email.length === 0 || password.length === 0){
        errors = true;
        res.send('กรุณากรอกชื่อและรหัสผ่าน');
    }

    if(!errors){
        bcrypt.hash(password, 10, (err,hash) => {
            if(err) {
                throw err;
                return res.status(500).send({
                    message: err,
                });
            } else {
                let form_data = {
                    email : email,
                    password: hash,
                    role : role,
                    f_name : f_name,
                    l_name: l_name,
                    tel_num : tel_num,
                    gender : gender,
                    address: address,
                    img: img,
                    agencies_id : agencies_id
                }
                // update query
                db.query('UPDATE users SET ? WHERE user_id = ' + id, form_data, (err,result) => {
                    if (err) {
                        res.send('เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้งาน', err);
                    } else {
                        res.send('อัพเดตข้อมูลผู้ใช้งานสำเร็จ');
        
                    }
                })
            }
        });
    }
})

// Delete users by id
router.delete('/users/:id',(req, res) => {
    db.query('DELETE FROM users WHERE user_id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('ลบผู้ใช้งานสำเร็จ');
        } else {
            console.log(err)
        }
    })
})

// Insert users
router.post('/users',(req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;
    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let tel_num = req.body.tel_num;
    let gender = req.body.gender;
    let address = req.body.address;
    let img = req.body.img;
    let agencies_id = req.body.agencies_id;
    
    db.query(`SELECT user_id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})`, (err, result) => {
        if(result && result.length) { 
            //error
            return res.status(409).send({
                message: 'อีเมลนี้มีอยู่ในระบบแล้ว'
            });
        } else { //email not in use
            bcrypt.hash(password, 10, (err,hash) => {
                if(err) {
                    throw err;
                    return res.status(500).send({
                        message: err,
                    });
                } else {
                    let form_data = {
                        email : email,
                        password: hash,
                        role : role,
                        f_name : f_name,
                        l_name: l_name,
                        tel_num : tel_num,
                        gender : gender,
                        address: address,
                        img: img,
                        agencies_id : agencies_id
                    }
                    db.query(`INSERT INTO users SET ?`,[form_data],(err,result) => {
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