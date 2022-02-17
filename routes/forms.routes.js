const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase.js');

// Get all forms
router.get('/forms',(req, res) => {
    let user_id = req.body.user_id;
    let role = req.body.role;
    let agency = req.body.agency;
    if (role === 'admin') {
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,users_id FROM forms 
        INNER JOIN users on forms.users_id = user_id `,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role === 'chief'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,users_id FROM forms 
        INNER JOIN users on forms.users_id = user_id 
        INNER JOIN agency on agency_id = users.agencies_id 
        AND agency.agency_name = ?`,agency,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role === 'officer'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,users_id FROM forms 
        WHERE users_id = ?`,user_id,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    }else {
        console.log(err)
        res.send(err);
    }
    
})

// Insert forms
router.post('/forms',(req, res) => {
    let form_name = req.body.form_name;
    let form_specific = req.body.form_specific;
    form_specific = JSON.stringify(form_specific);
    let created_by = req.body.users_id;
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
                    db.query(`INSERT INTO forms (form_name, form_specific, created_date, approval_name, form_status, users_id) 
                            VALUES ('${form_name}', '${form_specific}', now(), '${approval_name}', '${form_status}', '${created_by}');`,(err, result) => {
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