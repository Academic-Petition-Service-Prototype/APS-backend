const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all report
router.get('/reports',(req, res) => {
    db.query('SELECT id, report_title, report_detail,  report_state, report_created FROM reports',(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get report by id
router.get('/reports/:id',(req, res) => {
    let id = req.params.id;
    db.query('SELECT id, report_title, report_detail,  report_state, report_created FROM reports WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('Report not found with id = ' + id)
        } else {
            res.send(rows[0]);
        }
    })
})

// Change state report
router.put('/reports',(req, res) => {
    let id = req.body.id;
    db.query(`UPDATE reports SET report_state = 'read' WHERE reports.id = ${id};`,(err, rows, fields) => {
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
    let errors = false;
    if(report_title.length === 0 || report_detail.length === 0 ){
        errors = true;
        res.send('Please fill your information');
    }

    if(!errors){
        let form_data = {
            report_title: report_title,
            report_detail: report_detail,
            report_state: 'unread',
            report_created: new Date(),
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