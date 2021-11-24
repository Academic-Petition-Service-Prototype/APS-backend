const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all groups
router.get('/groups',(req, res) => {
    db.query('SELECT * FROM groups',(err, rows, fields) => {
        console.log(rows);
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get groups by id
router.get('/groups/:id',(req, res) => {
    let id = req.params.id;
    db.query('SELECT * FROM groups WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('Groups not found with id = ' + id)
        } else {
            res.send(rows);
        }
    })
})

//update groups by id
router.post('/groups/:id', (req, res, next) => {
    let id = req.params.id;
    let groupname = req.body.groupname;
    let groupdetail = req.body.groupdetail;
    let errors = false;

    if (groupname.length === 0 || groupdetail.length === 0){
        errors = true;
        res.send('error','Please fill your information');
        
    }

    if(!errors){
        let form_data = {
            groupname: groupname,
            groupdetail: groupdetail,
        }
        // update query
        db.query('UPDATE groups SET ? WHERE id = ' + id, form_data, (err,result) => {
            if (err) {
                res.send('Update Error!', err);
            } else {
                res.send('Update Success!');

            }
        })
    }
})

// Delete groups by id
router.delete('/groups/:id',(req, res) => {
    db.query('DELETE FROM groups WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('Deleted group successful');
        } else {
            console.log(err)
        }
    })
})

// Insert groups
router.post('/groups',(req, res) => {
    let groupname = req.body.groupname;
    let groupdetail = req.body.groupdetail;
    let errors = false;

    if(groupname.length === 0 || groupdetail.length === 0){
        errors = true;
        res.send('Please fill your information');
    }

    if(!errors){
        let form_data = {
            groupname: groupname,
            groupdetail: groupdetail,
        }
        
        db.query('INSERT INTO groups SET ?',[form_data],(err, result) => {
            if(!err){
                res.send('Add group successful');
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;