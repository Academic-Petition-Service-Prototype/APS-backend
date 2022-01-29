const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase.js');

// Insert forms
router.post('/forms',(req, res) => {
    let form_name = req.body.form_name;
    let form_specific = req.body.form_specific;
    form_specific = JSON.stringify(form_specific);
    let created_by = req.body.f_name + ' ' + req.body.l_name;
    let approval_name = req.body.approval_name;
    approval_name = JSON.stringify(approval_name);
    let form_status = 'active';
    let error = false;

    if(form_name == undefined){
        error = true;
        res.send('กรุณากรอกชื่อคำร้อง');
    }

    if(!error){
        db.query(
            `SELECT id FROM forms WHERE form_name = ${db.escape(req.body.form_name)}`, 
            (err, result) => {
                if(result && result.length) { 
                    //error
                    res.send('ชื่อคำร้องนี้มีอยู่ในระบบแล้ว');
                } else { //form name not in use
                    db.query(`INSERT INTO forms (form_name, form_specific, created_date, created_by, approval_name,form_status ) 
                            VALUES ('${form_name}', '${form_specific}', now(), '${created_by}', '${approval_name}', '${form_status}');`,(err, result) => {
                        if(!err){
                            res.send('เพิ่มคำร้องใหม่สำเร็จ');
                        } else {
                            console.log(err)
                        }
                    })
                }
            }
        );
    }
})

module.exports = router;