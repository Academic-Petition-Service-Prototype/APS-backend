const mysql = require('mysql');
const router = require('express').Router();

// Database
const db = require('../lib/connectdatabase');

// Get all tags
router.get('/tags',(req, res) => {
    db.query('SELECT * FROM tags',(err, rows, fields) => {
        console.log(rows);
        if(!err){
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get tags by agency
router.post('/tagsbyagency',(req, res) => {
    let agency_id = req.body.agency_id;
    
    db.query(`SELECT tag_id, tag_name FROM tags 
    WHERE agencies_id = ?`,agency_id,(err, rows, fields) => {
        if(!err){
            console.log(rows);
            res.send(rows);
        } else {
            console.log(err)
        }
    })
})

// Get tags by id
router.get('/tags/:id',(req, res) => {
    db.query('SELECT * FROM tags WHERE tag_id = ?',[req.params.id],(err, rows, fields) => {
        if(rows.length <= 0){
            res.send('ไม่พบแท็คหมายเลข'+req.params.id+'ในฐานข้อมูล')
        } else {
            res.send(rows);
        }
    })
})

//update tags by id
router.post('/tags/:id', (req, res, next) => {
    let tag_id = req.params.id;
    let tag_name = req.body.tag_name;
    let errors = false;

    if (tag_name.length === undefined){
        errors = true;
        res.send('กรุณากรอกชื่อหมวดหมู่คำร้อง');
    }

    if(!errors){
        // update query
        db.query(`UPDATE tags SET tag_name = ? WHERE tag_id = ?`,[tag_name, tag_id],(err,result) => {
            if (err) {
                res.send('เกิดข้อผิดพลาดในการอัพเดตแท็ค', err);
            } else {
                res.send('อัพเดตหมวดหมู่สำเร็จ');

            }
        })
    }
})

// Delete tags by id
router.delete('/tags/:id',(req, res) => {
    db.query('DELETE FROM tag WHERE tag_id = ?',[req.params.id],(err, rows, fields) => {
        if(!err){
            res.send('ลบหมวดหมู่สำเสร็จ');
        } else {
            console.log(err)
        }
    })
})

// Insert tag
router.post('/tags',(req, res) => {
    let tag_name = req.body.tag_name;
    let tag_created = new Date();
    let agencies_id = req.body.agencies_id;
    let errors = false;

    if(tag_name.length === undefined){
        errors = true;
        // res.send('Please fill your information');
        res.send('กรุณากรอกชื่อหมวดหมู่คำร้อง');
    }

    if(!errors){
        db.query(
            `SELECT tag_id, tag_name FROM forms 
            INNER JOIN tags on forms.tags_id = tag_id 
            INNER JOIN users on forms.users_id = user_id 
            WHERE agencies_id = ? AND tag_name = ?`,[agencies_id,tag_name], 
            (err, result) => {
                if(result && result.length) { 
                    //error
                    res.send('หมวดหมู่นี้มีอยู่ในระบบของหน่วยงานแล้ว');
                } else { //agency name not in use
                    db.query(`INSERT INTO tags (tag_name, tag_created, agencies_id) 
                    VALUES ('${tag_name}',${tag_created}),'${agencies_id}');`,(err, result) => {
                        if(!err){
                            res.send('เพิ่มหมวดหมู่สำเร็จ');
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