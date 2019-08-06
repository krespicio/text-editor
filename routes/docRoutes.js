const express = require("express");
const router = express.Router(); 
const {Document} = require("./models");
const mongoose = require("mongoose"); 


//creates and saves a new document
router.post("/createDoc", function(req, res){
    
    let newDoc = new Document({
        title: req.body.title, 
        password: req.body.password, 
        owner: req.user, 
        collaborators: [req.user], 
        body: []
    }); 

    newDoc.save(function(err,result){
        if (err) {
            console.log(err); 
            res.json({success: false, error: err});
        }
        if (!err) {
            console.log('successfully saved');
            res.json({success: true, error: ''});
        }
    });
    
});

//saves the new body and updates the document
router.post("/docs/:docId/save", function(req, res){
    let body = new Body ({
        timestamp: new Date(),
        content: req.body.content
    }); 

    Document.findOne({_id: docId}, function(err, result){
        if (err) {
            console.log(err); 
            res.json({success: false, error: err}); 
        }

        if(!err) {
            console.log(result); 
            result.body.push(body); 
            result.save(function(err, success){
                if (err) {
                    res.json({success: false, error: err}); 
                }
                if (success) {
                    console.log('successfully saved the updated document')
                    res.json({success: true, error: ''}); 
                }
            }); 
            
        }
    })
});





module.exports = router; 