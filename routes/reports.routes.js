const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all report by agency_id
router.post('/agencyreports',(req, res) => {
    agency_id = req.body.agency_id;
    
    db.query(`SELECT report_id, report_title, report_detail, report_state, report_created
    FROM reports
    INNER JOIN users
    ON reports.users_id = users.user_id
    WHERE agencies_id = ? ORDER BY report_created DESC`,[agency_id],(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get all reports
router.get('/reports',(req, res) => {
    db.query('SELECT report_id, report_title, report_detail, report_state, report_created FROM reports ORDER BY report_created DESC',(err, rows, fields) => {
        console.log(rows);
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get report by id
router.get('/reports/:id',(req, res) => {
    db.query('SELECT report_id, report_title, report_detail, report_state, report_created FROM reports WHERE report_id = ?',[req.params.id],(err, rows, fields) => {
        console.log(rows)
        if(rows.length <= 0){
            res.send('Report not found with id = ' + req.params.id)
        } else {
            res.send(rows[0]);
        }
    })
})

// Change state report
router.put('/reports',(req, res) => {
    db.query(`UPDATE reports SET report_state = 'read' WHERE reports.report_id = ${req.body.id};`,(err, rows, fields) => {
        if(!err){
            res.send('Change state success');
        } else {
            res.send(err);
        }
    })
})

// Insert reports
router.post('/reports',(req, res) => {
    let users_id = req.body.users_id;
    let report_title = req.body.report_title;
    let report_detail = req.body.report_detail;
    let report_occur = req.body.report_occur;
    let errors = false;
    if((report_title.length === 0 || report_detail.length === 0) || (report_title.length == undefined || report_detail.length == undefined)){
        errors = true;
        res.send('Please fill your information');
    }

    if(!errors){
        let form_data = {
            report_title: report_title,
            report_detail: report_detail,
            report_state: 'unread',
            report_created: new Date(),
            report_occur: report_occur,
            users_id: users_id
        }
        
        db.query('INSERT INTO reports SET ?',[form_data],(err, result) => {
            if(!err){
                res.send('Sent report successful');
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;