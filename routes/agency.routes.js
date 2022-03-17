const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all agency
router.get('/agency',(req, res) => {
    db.query('SELECT * FROM agency',(err, rows, fields) => {
        console.log(rows);
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get agency by id
router.get('/agency/:id',(req, res) => {
    db.query('SELECT * FROM agency WHERE agency_id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.status(409).send('ไม่พบหน่วยงานหมายเลข'+req.params.id+'ในฐานข้อมูล')
        } else {
            res.send(rows);
        }
    })
})

//update agency by id
router.post('/agency/:id', (req, res, next) => {
    let agency_id = req.params.id;
    let agency_name = req.body.agency_name;
    let errors = false;

    if (agency_name.length === 0){
        errors = true;
        res.send('กรุณากรอกข้อมูลให้ครบ');
    }

    if(!errors){
        // update query
        db.query(`UPDATE agency SET agency_name = ? WHERE agency_id = ?`,[agency_name, agency_id],(err,result) => {
            if (err) {
                res.send('เกิดข้อผิดพลาดในการอัพเดตหน่วยงาน', err);
            } else {
                res.send('อัพเดตหน่วยงานสำเร็จ');

            }
        })
    }
})

// Delete agency by id
router.delete('/agency/:id',(req, res) => {
    db.query('DELETE FROM agency WHERE agency_id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('ลบหน่วยงานสำเสร็จ');
        } else {
            console.log(err)
        }
    })
})

// Insert agency
router.post('/agency',(req, res) => {
    let agency_name = req.body.agency_name;
    let errors = false;

    if(agency_name.length === 0){
        errors = true;
        // res.send('Please fill your information');
        res.status(409).send('กรุณากรอกข้อมูลให้ครบ');
    }

    if(!errors){
        db.query(
            `SELECT agency_id FROM agency WHERE agency_name = ${db.escape(req.body.agency_name)}`, 
            (err, result) => {
                if(result && result.length) { 
                    //error
                    res.send('หน่วยงานนี้มีอยู่ในระบบแล้ว');
                } else { //agency name not in use
                    db.query(`INSERT INTO agency (agency_name, agency_created) 
                    VALUES ('${agency_name}',now());`,(err, result) => {
                        if(!err){
                            res.send('เพิ่มหน่วยงานสำเสร็จ');
                        } else {
                            console.log(err)
                        }
                    })
                }
            }
        );
    }
})

module.exports = router;