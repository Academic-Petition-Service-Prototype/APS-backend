const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all users
router.get('/users',(req, res) => {
    db.query('SELECT * FROM users',(err, rows, fields) => {
        console.log(rows);

        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get users by id
router.get('/users/:id',(req, res) => {
    let id = req.params.id;
    db.query('SELECT * FROM users WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('User not found with id = ' + id)
        } else {
            res.send(rows);
        }
    })
})

//update users by id
router.post('/users/:id', (req, res, next) => {
    let id = req.params.id;
    let username = req.body.username;
    let password = req.body.password;
    let status = req.body.status;
    let f_name = req.body.f_name;
    let l_name = req.body.l_name;
    let tel_num = req.body.tel_num;
    let email = req.body.email;
    let gender = req.body.gender;
    let group_id = req.body.group_id;
    let errors = false;

    if (username.length === 0 || password.length === 0){
        errors = true;
        res.send('error','Please fill your information');
        
    }

    if(!errors){
        let form_data = {
            username: username,
            password: password,
            status : status,
            f_name : f_name,
            l_name: l_name,
            tel_num : tel_num,
            email : email,
            gender : gender,
            group_id : group_id
        }
        // update query
        db.query('UPDATE users SET ? WHERE id = ' + id, form_data, (err,result) => {
            if (err) {
                res.send('Update Error!', err);
            } else {
                res.send('Update Success!');

            }
        })
    }
})

// Delete users by id
router.delete('/users/:id',(req, res) => {
    db.query('DELETE FROM users WHERE id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('Deleted user successful');
        } else {
            console.log(err)
        }
    })
})

// Insert users
router.post('/users',(req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let status = req.body.status;
    let group_id = req.body.group_id;
    let errors = false;

    if(username.length === 0 || password.length === 0 || status.length === 0 || group_id.length === 0){
        errors = true;
        res.send('Please fill your information');
    }

    if(!errors){
        let form_data = {
            username: username,
            password: password,
            status : status,
            group_id : group_id
        }
        
        db.query('INSERT INTO users SET ?',[form_data],(err, result) => {
            if(!err){
                res.send('Add user successful');
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;