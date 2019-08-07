const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// User Mongo
const { User, Document, Body } = require("../models");

function hashPassword(password) {
	let hash = crypto.createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}

module.exports = function(passport) {
	router.post("/signup", function(req, res) {
		console.log("in here to sign up dad");
		const newUser = new User({
			username: req.body.username,
			password: hashPassword(req.body.password),
			documents: [],
		});
		console.log(newUser);
		newUser.save(function(err, result) {
			console.log(err, result);
			console.log("hiii");
			if (err) {
				console.log("we be erroring");
				res.json({ success: false, error: err });
			}
			if (!err) {
				console.log("mama i made it");
				res.json({ success: true, error: "" });
			}
		});
	});

	router.post(
		"/login",
		passport.authenticate("local", {
			successRedirect: "/login/success",
			failureRedirect: "/login/failure",
		})
	);

	// router.get("/user", async (req, res) => {
	// 	console.log(req.user);
	// 	if (req.user) {
	// 		res.send({ loggedIn: true });
	// 	} else {
	// 		res.send({ loggedIn: false });
	// 	}
	// });

	router.get("/login/success", (req, res) => {
		res.json({ success: true });
		console.log("success", req.user, req.session.user);

		return;
	});

	router.get("/login/failure", (req, res) => {
		res.json({ success: false });
		return;
	});

	//GET Logout page
	router.get("/logout", function(req, res) {
		req.logout();
		res.json({
			success: true,
			error: "",
		});
	});

	// router.post("/createDoc", function(req, res){

	// 	let newDoc = new Document({
	// 		title: req.body.title,
	// 		password: req.body.password,
	// 		owner: req.user._id,
	// 		collaborators: [req.user._id],
	// 		body: []
	// 	});

	// 	newDoc.save(function(err,result){
	// 		if (err) {
	// 			console.log(err);
	// 			res.json({success: false, error: err});
	// 		}
	// 		if (!err) {
	// 			console.log('successfully saved');
	// 			res.json({success: true, error: ''});
	// 		}
	// 	});

	// });

	// router.post("/docs/:docId/save", function(req, res){

	// 	let docId = req.params.docId;
	// 	let body = new Body ({
	// 		timestamp: new Date(),
	// 		content: req.body.content
	// 	});

	// 	Document.findOne({_id: docId}, function(err, result){
	// 		if (err) {
	// 			console.log(err);
	// 			res.json({success: false, error: err});
	// 		}

	// 		if(!err) {
	// 			console.log(result);
	// 			body.save();
	// 			result.body.push(body);
	// 			result.save(function(err, success){
	// 				if (err) {
	// 					res.json({success: false, error: err});
	// 				}
	// 				if (success) {
	// 					console.log('successfully saved the updated document')
	// 					res.json({success: true, error: ''});
	// 				}
	// 			});

	// 		}
	// 	})
	// });

	// router.post("/docs/:docId/addCollab", function(req, res){
	// 	let collaborator = req.body.collabId;
	// 	let docId = req.params.docId;

	// 	Document.findOne({_id: docId}, function(err, result){
	// 		if (err) {
	// 			res.json({success: false, error: err});
	// 		}
	// 		if (!err) {
	// 			console.log(result);
	// 			result.collaborators.push(collaborator);
	// 			result.save(function(err, success){
	// 				if (err){
	// 					res.json({success: false, error: err});
	// 				}

	// 				if(!err) {
	// 					console.log('successfully added a collaborator');
	// 					res.json({success: true, error: ''});
	// 				}
	// 			})
	// 		}
	// 	})
	// });
	// router.post("/docs/:docId/remCollab", function(req, res){
	// 	console.log(req.user);
	// 	let collaborator = req.body.collabId;
	// 	let docId = req.params.docId;
	// 	Document.findOne({_id: docId}, function(err, result){
	// 		if (err) {
	// 			res.json({success: false, error: err});
	// 		}
	// 		if (!err) {
	// 			console.log(result.owner._id);
	// 			if (collaborator===result.owner._id) {
	// 				res.json({success: false, error: 'Cannot remove owner from collaborators'});
	// 			}
	// 			const index = result.collaborators.indexOf(collaborator);
	// 			console.log('index of collaborator is', index);
	// 			result.collaborators = result.collaborators.splice(index, 1);
	// 			result.save(function(err, success){
	// 				if (err){
	// 					res.json({success: false, error: err});
	// 				}

	// 				if(!err) {
	// 					console.log('successfully removed a collaborator');
	// 					res.json({success: true, error: ''})
	// 				}
	// 			})
	// 		}
	// 	})
	// });
	router.use((req, res, next) => {
		console.log("cookies", req.cookies, req.session);

		console.log("This is the user in the use", req.user);
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: "Not authorized",
			});
			return;
		}
		next();
	});

	router.post("/user", (req, res) => {
		res.json({ success: true });
	});

	return router;
};
