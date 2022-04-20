const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all request by agency_id
router.post('/agencyrequests',(req, res) => {
    agency_id = req.body.agency_id;
    
    db.query(`SELECT request_id, request_title, request_detail, request_state, request_created
    FROM requests
    INNER JOIN users
    ON requests.users_id = users.user_id
    WHERE agencies_id = ? ORDER BY request_created DESC`,[agency_id],(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get all requests
router.get('/requests',(req, res) => {
    db.query('SELECT request_id, request_title, request_detail, request_state, request_created FROM requests ORDER BY request_created DESC',(err, rows, fields) => {
        console.log(rows);
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get request by id
router.get('/requests/:id',(req, res) => {
    db.query('SELECT request_id, request_title, request_detail, request_state, request_created FROM requests WHERE request_id = ?',[req.params.id],(err, rows, fields) => {
        console.log(rows)
        if(rows.length <= 0){
            res.send('request not found with id = ' + req.params.id)
        } else {
            res.send(rows[0]);
        }
    })
})

// Change state requests
router.put('/requests',(req, res) => {
    db.query(`UPDATE requests SET request_state = 'read' WHERE requests.request_id = ${req.body.id};`,(err, rows, fields) => {
        if(!err){
            res.send('Change state success');
        } else {
            res.send(err);
        }
    })
})

// Insert requests
router.post('/requests',(req, res) => {
    let users_id = req.body.users_id;
    let request_title = req.body.request_title;
    let request_detail = req.body.request_detail;
    let errors = false;
    if((request_title.length === 0 || request_detail.length === 0) || (request_title.length == undefined || request_detail.length == undefined)){
        errors = true;
        res.send('Please fill your information');
    }

    if(!errors){
        let form_data = {
            request_title: request_title,
            request_detail: request_detail,
            request_state: 'unread',
            request_created: new Date(),
            users_id: users_id
        }
        
        db.query('INSERT INTO requests SET ?',[form_data],(err, result) => {
            if(!err){
                res.send('Sent request successful');
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;