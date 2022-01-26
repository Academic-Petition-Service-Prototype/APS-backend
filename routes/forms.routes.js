const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase.js');

// Insert forms
router.post('/forms',(req, res) => {
    let form_name = req.body.form_name;
    let form_specific = req.body.form_specific;
    let created_date = now();
    let created_by = req.body.f_name + '-' + req.body.l_name;
    let approval_name = req.body.approval_name;
    let form_status = 'active';

    if(form_name.length === 0){
        return res.status(409).send({
            message: 'กรุณากรอกชื่อคำร้อง'
        });
    }

    db.query(
        `SELECT id FROM forms WHERE form_name = ${db.escape(req.body.form_name)}`, 
        (err, result) => {
            if(result && result.length) { 
                //error
                return res.status(409).send({
                    message: 'ชื่อคำร้องนี้มีอยู่ในระบบแล้ว'
                });
            } else { //form name not in use
                let form_data = {
                    form_name: form_name,
                    form_specific: form_specific,
                    created_date : created_date,
                    created_by : created_by,
                    approval_name : approval_name,
                    form_status : form_status
                }
                
                db.query('INSERT INTO users SET ?',[form_data],(err, result) => {
                    if(!err){
                        res.send('เพิ่มคำร้องใหม่สำเร็จ');
                    } else {
                        console.log(err)
                    }
                })
            }
        }
    );
})

module.exports = router;