const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase.js');

// Get all forms
router.post('/getforms',(req, res) => {
    let user_id = req.body.user_id;
    let role = req.body.role;
    let agency = req.body.agency;
    if (role === 'admin') {
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,form_detail,users_id,tags_id FROM forms 
        INNER JOIN users on forms.users_id = user_id `,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role === 'chief'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,form_detail,users_id,tag_id,tag_name FROM forms 
        INNER JOIN tags on forms.tags_id = tag_id
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
    }else if(role === 'user'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,form_detail,users_id,tag_id,tag_name FROM forms 
        INNER JOIN tags on forms.tags_id = tag_id
        INNER JOIN users on forms.users_id = user_id 
        INNER JOIN agency on agency_id = users.agencies_id 
        AND agency.agency_name = ? AND form_status = 1`,agency,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role === 'officer'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,form_detail,users_id,tags_id FROM forms 
        WHERE users_id = ?`,user_id,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    }else {
        console.log("err");
        res.status(421)
    }
    
})

// Get form by id
router.get('/forms/:id',(req, res) => {
    let id = req.params.id;
    db.query('SELECT * FROM forms WHERE form_id = ?',[req.params.id],(err, rows, fields) => {
        console.log(rows);
        if(rows.length <= 0){
            res.send('Petition not found with id = ' + id)
        } else {
            res.send(rows[0]);
        }
    })
})

// Change status form
router.put('/changestatusforms',(req, res) => {
    let form_id = req.body.form_id;
    let form_status = req.body.form_status;
    db.query(`UPDATE forms SET form_status = ? WHERE forms.form_id = ?;`,[form_status,form_id],(err, rows, fields) => {
        if(!err){
            console.log('Change status form success')
            res.send('Change state success');
        } else {
            console.log('Change status form fail')
            res.send(err);
        }
    })
})

// Insert forms
router.post('/insertforms',(req, res) => {
    let form_name = req.body.form_name;
    let form_specific = req.body.form_specific;
    form_specific = JSON.stringify(form_specific);
    let created_by = req.body.users_id;
    let approval_name = req.body.approval_name;
    approval_name = JSON.stringify(approval_name);
    let form_detail = req.body.form_detail;
    let tags_id = req.body.tag_id;
    let form_status = 'active';
    let error = false;

    if(form_name == undefined){
        error = true;
        res.send('กรุณากรอกชื่อคำร้อง');
    }

    if(!error){
        db.query(`INSERT INTO forms (form_name, form_specific, created_date, approval_name, form_status, form_detail, users_id, tags_id) 
                VALUES ('${form_name}', '${form_specific}', now(), '${approval_name}', '${form_status}', '${form_detail}', '${created_by}', '${tags_id}');`,(err, result) => {
            if(!err){
                res.send('เพิ่มคำร้องใหม่สำเร็จ');
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;