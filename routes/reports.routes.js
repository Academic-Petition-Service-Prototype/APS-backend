const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Insert reports
router.post('/reports',(req, res) => {
    let report_title = req.body.report_title;
    let report_detail = req.body.report_detail;
    let errors = false;

    if(report_title.length === 0 || report_detail.length === 0){
        errors = true;
        res.send('Please fill your information');
    }

    if(!errors){
        let form_data = {
            report_title: report_title,
            report_detail: report_detail,
            report_state: 'unread',
            report_created: new Date(),
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