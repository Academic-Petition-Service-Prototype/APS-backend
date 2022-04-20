const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = require('express').Router();


// Database
const db = require('../lib/connectdatabase');

// Get all users
router.post('/getusers',(req, res) => {
    let role = req.body.role;
    let roletarget = req.body.roletarget;
    let agency_id = req.body.agency_id;
    if(role == 'admin'){
        db.query(`SELECT user_id , registered, agency_name, CONCAT(f_name," ",l_name) AS fullname 
        FROM users
        INNER JOIN agency ON agency_id = users.agencies_id
        WHERE role = ? ORDER BY agency_name DESC`,[roletarget],(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role == 'chief'){
        db.query(`SELECT user_id, gender, registered, agency_name, CONCAT(f_name," ",l_name) AS fullname 
        FROM users
        INNER JOIN agency ON agency_id = users.agencies_id
        WHERE role = ? AND agencies_id = ? ORDER BY agency_name DESC`,[roletarget, agency_id],(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    }
    // db.query('SELECT * FROM users',(err, rows, fields) => {
    //     console.log(rows);
    //     if(!err){
    //         res.send(rows);
    //     } else {
    //         console.log(err)
    //     }
    // })
})

// Get users by id
router.get('/users/:id',(req, res) => {
    let id = req.params.id;
    db.query('SELECT user_id, email, role, f_name, l_name, tel_num, gender, address, img, agencies_id FROM users WHERE user_id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('ไม่พบผู้ใช้งานหมายเลข'+id+'ในฐานข้อมูล')
        } else {
            console.log(rows[0]);
            res.send(rows[0]);
        }
    })
})

// Get chief by id
router.get('/getchief/:id',(req, res) => {
    db.query(`SELECT user_id, f_name, l_name FROM users WHERE agencies_id = ? AND role = 'chief'`,[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('ไม่พบ chief')
        } else {
            res.send(rows);
        }
    })
})

//update users by id
router.patch('/users/:id', (req, res, next) => {
    let id = req.params.id;
    // let email = req.body.email;
    let password = req.body.password;
    let role = req.body.role;
    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let tel_num = req.body.tel_num;
    let gender = req.body.gender;
    let address = req.body.address;
    let agencies_id = req.body.agencies_id;
    let errors = false;

    // if (email === undefined){
    //     errors = true;
    //     res.send('กรุณากรอกอีเมล');
    // }

    if (!(req.files && req.files.img)){

        let form_data = {
            role : role,
            f_name : f_name,
            l_name: l_name,
            tel_num : tel_num,
            gender : gender,
            address: address,
            agencies_id : agencies_id
        }

        db.query(`SELECT user_id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})`, (err, result) => {
            if(result && result.length) { 
                //error
                return res.status(409).send({
                    message: 'อีเมลนี้มีอยู่ในระบบแล้ว'
                });
            } else {
                if(req.body.password === undefined || req.body.password === "" || req.body.password === null) {
                    // update query
                    db.query('UPDATE users SET ? WHERE user_id = ' + id, form_data, (err,result) => {
                        if (err) {
                            res.status(400).send('เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้งาน', err);
                        } else {
                            console.log(result)
                            res.send('อัพเดตข้อมูลสำเร็จ');
                        }
                    })
                } else {
                    // update query
                    bcrypt.hash(password, 10, (err,hash) => {
                        if(err) {
                            throw err;
                            return res.status(500).send({
                                message: err,
                            });
                        } else {
                            let form_data = {
                                password: hash,
                                role : role,
                                f_name : f_name,
                                l_name: l_name,
                                tel_num : tel_num,
                                gender : gender,
                                address: address,
                                agencies_id : agencies_id
                            }
                            // update query
                            db.query('UPDATE users SET ? WHERE user_id = ' + id, form_data, (err,result) => {
                                if (err) {
                                    throw err;
                                    res.status(400).send(err);
                                } else {
                                    console.log(result)
                                    res.send('อัพเดตข้อมูลสำเร็จ');
                                }
                            })
                        }
                    });
                }
            }
        });
    } else {
        let img = req.files.img;
        if(!errors){
            var filename1 = img.name
            const filename = Date.now()+""+ filename1;
            const file = req.files.img;
            const pathimg = "/" + role +"_img/"
            const URL = "/../avatar/"+pathimg+filename;
            let uploadPath = __dirname+URL;
            file.mv(uploadPath,(err)=>{
                if(err){
                    errors = true;
                    return res.send(err)
                }
            })
    
            let form_data = {
                role : role,
                f_name : f_name,
                l_name: l_name,
                tel_num : tel_num,
                gender : gender,
                address: address,
                img: filename,
                agencies_id : agencies_id
            }
    
            db.query(`SELECT user_id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})`, (err, result) => {
                if(result && result.length) { 
                    //error
                    return res.status(409).send({
                        message: 'อีเมลนี้มีอยู่ในระบบแล้ว'
                    });
                } else {
                    if(req.body.password === undefined || req.body.password === "" || req.body.password === null) {
                        // update query
                        db.query('UPDATE users SET ? WHERE user_id = ' + id, form_data, (err,result) => {
                            if (err) {
                                throw err;
                                res.status(400).send('เกิดข้อผิดพลาดในการอัพเดตข้อมูลผู้ใช้งาน', err);
                            } else {
                                console.log(result)
                                res.send('อัพเดตข้อมูลสำเร็จ');
                            }
                        })
                    } else {
                        // update query
                        bcrypt.hash(password, 10, (err,hash) => {
                            if(err) {
                                throw err;
                                return res.status(500).send({
                                    message: err,
                                });
                            } else {
                                let form_data = {
                                    password: hash,
                                    role : role,
                                    f_name : f_name,
                                    l_name: l_name,
                                    tel_num : tel_num,
                                    gender : gender,
                                    address: address,
                                    img: filename,
                                    agencies_id : agencies_id
                                }
                                // update query
                                db.query('UPDATE users SET ? WHERE user_id = ' + id, form_data, (err,result) => {
                                    if (err) {
                                        throw err;
                                        res.status(400).send(err);
                                    } else {
                                        res.send('อัพเดตข้อมูลสำเร็จ');
                                    }
                                })
                            }
                        });
                    }
                }
            });
        }
    }
})

// Delete users by id
router.delete('/users/:id',(req, res) => {
    let user_id = req.body.user_id
    let role = req.body.role;
    if(role == 'officer'){
        db.query(`UPDATE forms SET users_id = ? WHERE forms.users_id = ?`,[user_id,req.params.id],(err, rows, fields) => {
            if(!err){
                db.query('DELETE FROM users WHERE user_id = ?',[req.params.id],(err, rows, fields) => {
                    if(!err){
                        console.log('ลบผู้พนักงานสำเร็จ')
                        res.send('ลบผู้พนักงานสำเร็จ');
                    } else {
                        console.log(err)
                    }
                })
            } else {
                console.log(err)
                res.send(err);
            }
        })
    } else {
        db.query('DELETE FROM users WHERE user_id = ?',[req.params.id],(err, rows, fields) => {
            if(!err){
                res.send('ลบ ' + role + ' สำเร็จ');
            } else {
                console.log(err)
            }
        })
    }
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
    let img = req.files.img;
    let agencies_id = req.body.agencies_id;
    
    db.query(`SELECT user_id FROM users WHERE LOWER(email) = LOWER(${db.escape(req.body.email)})`, (err, result) => {
        if(result && result.length) { 
            //error
            return res.send('อีเมลนี้มีอยู่ในระบบแล้ว');
        } else { //email not in use
            bcrypt.hash(password, 10, (err,hash) => {
                if(err) {
                    throw err;
                    return res.status(500).send({
                        message: err,
                    });
                } else {
                    var filename1 = img.name
                    const filename = Date.now()+""+ filename1;
                    const file = req.files.img;
                    const pathimg = "/" + role +"_img/"
                    const URL = "/../avatar/"+pathimg+filename;
                    let uploadPath = __dirname+URL;
                    file.mv(uploadPath,(err)=>{
                        if(err){
                            return res.send(err)
                        }
                    })

                    let form_data = {
                        email : email,
                        password: hash,
                        role : role,
                        f_name : f_name,
                        l_name: l_name,
                        tel_num : tel_num,
                        gender : gender,
                        address: address,
                        registered: new Date(),
                        img: filename,
                        agencies_id : agencies_id
                    }

                    db.query(`INSERT INTO users SET ?`,[form_data],(err,result) => {
                        if(err){
                            throw err;
                            return res.status(400).send({
                                message:err,
                            });
                        }else{
                            res.status(201).send('Add ' + role + ' success')
                        }
                    });
                    // if(role == 'chief'){
                    //     var filename1 = img.name
                    //     const filename = Date.now()+""+ filename1;
                    //     const file = req.files.img;
                    //     const chief_img = "/chief_img/"
                    //     const URL = "/../avatar/"+chief_img+filename;
                    //     let uploadPath = __dirname+URL;
                    //     file.mv(uploadPath,(err)=>{
                    //         if(err){
                    //             return res.send(err)
                    //         }
                    //     })

                    //     let form_data = {
                    //         email : email,
                    //         password: hash,
                    //         role : role,
                    //         f_name : f_name,
                    //         l_name: l_name,
                    //         tel_num : tel_num,
                    //         gender : gender,
                    //         address: address,
                    //         registered: new Date(),
                    //         img: filename,
                    //         agencies_id : agencies_id
                    //     }

                    //     db.query(`INSERT INTO users SET ?`,[form_data],(err,result) => {
                    //         if(err){
                    //             throw err;
                    //             return res.status(400).send({
                    //                 message:err,
                    //             });
                    //         }else{
                    //             res.status(201).send('Add chief success')
                    //         }
                    //     });
                    // } else if(role == 'secretary'){
                    //     var filename1 = img.name
                    //     const filename = Date.now()+""+ filename1;
                    //     const file = req.files.img;
                    //     const secretary_img = "/secretary_img/"
                    //     const URL = "/../avatar/"+secretary_img+filename;
                    //     let uploadPath = __dirname+URL;
                    //     file.mv(uploadPath,(err)=>{
                    //         if(err){
                    //             return res.send(err)
                    //         }
                    //     })

                    //     let form_data = {
                    //         email : email,
                    //         password: hash,
                    //         role : role,
                    //         f_name : f_name,
                    //         l_name: l_name,
                    //         tel_num : tel_num,
                    //         gender : gender,
                    //         address: address,
                    //         registered: new Date(),
                    //         img: filename,
                    //         agencies_id : agencies_id
                    //     }

                    //     db.query(`INSERT INTO users SET ?`,[form_data],(err,result) => {
                    //         if(err){
                    //             throw err;
                    //             return res.status(400).send({
                    //                 message:err,
                    //             });
                    //         }else{
                    //             res.status(201).send('Add secretary success')
                    //         }
                    //     });
                    // }
                }
            });
        }
    });
    
})

module.exports = router;