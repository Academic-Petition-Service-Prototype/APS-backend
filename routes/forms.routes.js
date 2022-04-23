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
        INNER JOIN users on forms.users_id = user_id ORDER BY created_date DESC`,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role === 'chief'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,form_detail,users_id,tag_id,tag_name,CONCAT(f_name," ",l_name) AS fullname FROM forms 
        INNER JOIN tags on forms.tags_id = tag_id
        INNER JOIN users on forms.users_id = user_id 
        INNER JOIN agency on agency_id = users.agencies_id 
        AND agency.agency_name = ? ORDER BY created_date DESC`,agency,(err, rows, fields) => {
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
        AND agency.agency_name = ? AND form_status = 1 ORDER BY created_date DESC`,agency,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err)
            }
        })
    } else if(role === 'officer'){
        db.query(`SELECT form_id,form_name,form_specific,created_date,approval_name,form_status,form_detail,users_id,tags_id FROM forms 
        WHERE users_id = ? ORDER BY created_date DESC`,user_id,(err, rows, fields) => {
            console.log(rows);
            if(!err){
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    }else {
        console.log("getforms error");
    }
    
})

// Get form by id
router.get('/forms/:id',(req, res) => {
    let form_id = req.params.id;
    db.query(`SELECT  form_id, form_name, form_specific, approval_name, form_detail, tag_id, tag_name FROM forms 
    INNER JOIN tags on forms.tags_id = tag_id 
    WHERE form_id = ?`,[form_id],(err, rows, fields) => {
        console.log(rows);
        if(rows.length <= 0){
            res.send('Petition not found with id = ' + form_id)
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

//update form by id
router.patch('/forms/:id', (req, res, next) => {
    let form_name = req.body.form_name;
    let form_specific = req.body.form_specific;
    form_specific = JSON.stringify(form_specific);
    let approval_name = req.body.approval_name;
    approval_name = JSON.stringify(approval_name);
    let form_detail = req.body.form_detail;
    let tags_id = req.body.tag_id;
    let error = false;

    if(form_name == undefined){
        error = true;
        res.send('กรุณากรอกชื่อคำร้อง');
    }

    if(!error){
        let form_data = {
            form_name : form_name,
            form_specific: form_specific,
            approval_name : approval_name,
            form_detail : form_detail,
            tags_id: tags_id,
        }

        db.query(`UPDATE forms SET ? WHERE form_id = ?`,[form_data,req.params.id],(err, result) => {
            if(!err){
                console.log(result)
                db.query(`UPDATE submitforms SET approval_order = ? WHERE forms_id = ?`,[approval_name,req.params.id],(err, result) => {
                    if(!err){
                        res.send('แก้ไขคำร้องใหม่สำเร็จ');
                        console.log(result)
                    } else {
                        console.log(err)
                    }
                })
            } else {
                console.log(err)
            }
        })
    }
})

// Delete form by id
router.delete('/forms/:id',(req, res) => {
    db.query('DELETE FROM forms WHERE form_id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('Delete petition success');
        } else {
            console.log(err)
        }
    })
})

// Insert forms
router.post('/insertforms',(req, res) => {
    let form_name = req.body.form_name;
    let form_specific = req.body.form_specific;
    let created_date = new Date();
    form_specific = JSON.stringify(form_specific);
    let created_by = req.body.users_id;
    let approval_name = req.body.approval_name;
    approval_name = JSON.stringify(approval_name);
    let form_detail = req.body.form_detail;
    let tags_id = req.body.tag_id;
    let form_status = 1;
    let error = false;

    if(form_name == undefined){
        error = true;
        res.send('กรุณากรอกชื่อคำร้อง');
    }

    if(!error){
        db.query(`INSERT INTO forms (form_name, form_specific, created_date, approval_name, form_status, form_detail, users_id, tags_id) 
                VALUES ('${form_name}', '${form_specific}', '${created_date}', '${approval_name}', '${form_status}', '${form_detail}', '${created_by}', '${tags_id}');`,(err, result) => {
            if(!err){
                res.send('เพิ่มคำร้องใหม่สำเร็จ');
                console.log(result)
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;