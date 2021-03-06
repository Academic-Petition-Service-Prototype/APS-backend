const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all submitforms by chief name in order
router.post('/getsubmitforms',(req, res) => {
    let user_id = '%user_id":' + req.body.user_id + ",%";

    db.query(`SELECT submit_id, submit_date, approval_order, submit_state, form_name , CONCAT(f_name," ",l_name) AS fullname
    FROM submitforms 
    FULL JOIN users ON users_id = users.user_id 
    JOIN forms ON forms_id = forms.form_id 
    WHERE approval_name LIKE ? ORDER BY submit_date DESC`,user_id,(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get submitforms by user
router.post('/getsubmitformsbyuser',(req, res) => {
    let user_id = req.body.user_id;

    db.query(`SELECT submit_id, submit_date, approval_order, submit_state, form_name, submit_refuse, CONCAT(f_name," ",l_name) AS fullname
    FROM submitforms 
    FULL JOIN users ON users_id = users.user_id 
    JOIN forms ON forms_id = forms.form_id 
    WHERE user_id = ? ORDER BY submit_date DESC`,user_id,(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get submitforms by officer created
router.post('/getsubmitformsbyofficer',(req, res) => {
    let user_id = req.body.user_id;

    db.query(`SELECT submit_id, submit_date, approval_order, submit_state, form_name, submit_refuse, CONCAT(f_name," ",l_name) AS fullname
    FROM submitforms 
    INNER JOIN forms ON forms_id = forms.form_id
    JOIN users ON user_id = forms.users_id 
    WHERE user_id = ? ORDER BY submit_date DESC`,user_id,(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get submitforms by agency
router.post('/getsubmitformsbyagency',(req, res) => {
    let agency_id = req.body.agency_id;

    db.query(`SELECT submit_id, submit_date, approval_order, submit_state, form_name, submit_refuse, CONCAT(f_name," ",l_name) AS fullname
    FROM submitforms 
    FULL JOIN users ON users_id = users.user_id 
    JOIN forms ON forms_id = forms.form_id 
    WHERE agencies_id = ? ORDER BY submit_date DESC`,agency_id,(err, rows, fields) => {
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get all submitforms
router.get('/getsubmitforms',(req, res) => {
    db.query(`SELECT submit_id, submit_date, approval_order, submit_state, submit_refuse, form_name, CONCAT(f_name," ",l_name) AS fullname
    FROM submitforms 
    INNER JOIN users ON users_id = users.user_id 
    JOIN forms ON forms_id = forms.form_id ORDER BY submit_date DESC`,(err, rows, fields) => {
        if(!err){
            res.send(rows);
            console.log(rows)
        } else {
            console.log(err)
        }
    })
})

// Get submitforms by id
router.get('/getsubmitforms/:id',(req, res) => {
    let submit_id = req.params.id;

    db.query(`SELECT email, f_name, l_name, tel_num, gender, address, submit_id, form_name, form_specific, form_value, approval_order, submit_state, submit_refuse, submit_date
    FROM submitforms 
    INNER JOIN users ON users_id = users.user_id 
    JOIN forms ON forms_id = forms.form_id 
    WHERE submit_id = ?`,submit_id,(err, rows, fields) => {
        if(!err){
            res.send(rows);
            console.log(rows)
        } else {
            console.log(err)
        }
    })
})

// Update submitforms
router.post('/approvepetition',(req, res) => {
    let submit_id = req.body.submit_id;
    let approval_order = req.body.approval_order;
    approval_order = JSON.stringify(approval_order);
    let submit_state = req.body.submit_state;
    let submit_refuse = req.body.submit_refuse;
    let form_value = req.body.form_value;
    if(typeof(form_value) != 'string'){
        form_value = JSON.stringify(form_value);
    }
    

    let form_data = {
        approval_order: approval_order,
        submit_state: submit_state,
        submit_refuse: submit_refuse,
        form_value: form_value,
    }

    db.query(`UPDATE submitforms SET ? WHERE submit_id = ?`,[form_data,submit_id],(err, rows, fields) => {
        if(!err){
            res.send('Approve petition successful');
        } else {
            console.log(err)
        }
    })
})

// Insert submitforms
router.post('/submitforms',(req, res) => {
    let users_id = req.body.users_id;
    let forms_id = req.body.forms_id;
    let form_value = req.body.form_value;
    form_value = JSON.stringify(form_value);
    let approval_order = req.body.approval_order;
    approval_order = JSON.stringify(approval_order);
    let submit_state = 0;
    let errors = false;

    if(!errors){
        let form_data = {
            form_value: form_value,
            submit_date: new Date(),
            submit_state: submit_state,
            approval_order: approval_order,
            users_id: users_id,
            forms_id: forms_id,
        }
        
        db.query(`INSERT INTO submitforms SET ?`,[form_data],(err, result) => {
            if(!err){
                res.send('Sent petition successful');
            } else {
                console.log(err)
            }
        })
    }
})

module.exports = router;