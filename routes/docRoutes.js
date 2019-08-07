const express = require("express");
const router = express.Router(); 
const { Document } = require("./models");
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

//adds a collaborator to the document

router.post("/createDoc", function(req, res){
    
    let newDoc = new Document({
        title: req.body.title, 
        password: req.body.password, 
        owner: req.user._id, 
        collaborators: [req.user._id], 
        body: []
    }); 

    newDoc.save(function(err,result){
        if (err) {
            console.log(err); 
            res.json({success: false, error: err});
        }
        if (!err) {
            console.log('successfully saved');
            User.findOne({_id: req.user._id}, function(err, user){
                if (err) {res.json({success: false, error: err})}
                if (!err) {
                    user.documents.push(newDoc); 
                    user.save(); 
                    res.json({success: true, error: 'no error'});
                }
            })
        }
    });
    
});

router.post("/docs/:docId/save", function(req, res){

    let docId = req.params.docId;
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
            body.save();
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

router.post("/docs/:docId/addCollab", function(req, res){
    let collaborator = req.body.collabId;
    let docId = req.params.docId;

    Document.findOne({_id: docId}, function(err, result){
        if (err) {
            res.json({success: false, error: err}); 
        }
        if (!err) {
            console.log(result);
            result.collaborators.push(collaborator); 
            result.save(function(err, success){
                if (err){
                    res.json({success: false, error: err});
                }

                if(!err) {
                    console.log('successfully added a collaborator');
                    res.json({success: true, error: ''});
                }
            })
        }
    })
});
router.post("/docs/:docId/remCollab", function(req, res){
    console.log(req.user);
    let collaborator = req.body.collabId; 
    let docId = req.params.docId; 
    Document.findOne({_id: docId}, function(err, result){
        if (err) {
            res.json({success: false, error: err}); 
        }
        if (!err) {
            console.log(result.owner._id); 
            if (collaborator===result.owner._id) {
                res.json({success: false, error: 'Cannot remove owner from collaborators'});
            }
            const index = result.collaborators.indexOf(collaborator); 
            console.log('index of collaborator is', index); 
            result.collaborators = result.collaborators.splice(index, 1); 
            result.save(function(err, success){
                if (err){
                    res.json({success: false, error: err});
                }

                if(!err) {
                    console.log('successfully removed a collaborator');
                    res.json({success: true, error: ''})
                }
            })
        }
    })
});  

router.get("/docs", function(req, res){
    Document.find(function(err, result){
        if (err) {
            res.json({success: false, error: err, data: []});
        }

        if(!err) {
            res.json({success: true, error: '', data: result});
        }
    })
}); 



router.get("/docs/:docId", function(req, res){
    let docId = req.params.docId;
    Document.findOne({_id: docId}, function(err, result){
        if (err){
            console.log(err); 
            res.json({success: false, error: err, data: null});
        }
        if (!err){
            res.json({success: true, error: '', data: result});
        }
    })

}); 

router.get("/docs/:docId/allCollabs", function(req, res){
    let docId = req.params.docId;
    Document.findOne({_id: docId}, function(err, result){
        if (err) {
            console.log(err);
            res.json({success: false, error: err, data: []});
    }

        if (!err) {
            let collabs = result.collaborators;
            res.json({success: true, error: '', data: collabs}); 
        }
    })
})


module.exports = router; 