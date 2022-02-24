const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Insert submitforms
router.post('/submitforms',(req, res) => {
    let users_id = req.body.users_id;
    let forms_id = req.body.forms_id;
    let form_value = req.body.form_value;
    form_value = JSON.stringify(form_value);
    let submit_date = new Date();
    let submit_state = 1;
    let errors = false;

    if(!errors){
        let form_data = {
            form_value: form_value,
            submit_date: submit_date,
            submit_state: submit_state,
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