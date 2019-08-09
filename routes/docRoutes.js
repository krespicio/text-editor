const express = require("express");
const router = express.Router();
const { Document, User, Body } = require("../models");
const mongoose = require("mongoose");

//adds a collaborator to the document

router.post("/createDoc", function(req, res) {
	let newDoc = new Document({
		title: req.body.title,
		password: req.body.password,
		owner: req.user._id,
		collaborators: [req.user._id],
		body: [],
	});

	newDoc.save(function(err, result) {
		if (err) {
			console.log(err);
			res.json({ success: false, error: err });
		}
		if (!err) {
			console.log("successfully saved");
			User.findOne({ _id: req.user._id }, function(err, user) {
				if (err) {
					res.json({ success: false, error: err });
				}
				if (!err) {
					user.documents.push(newDoc);
					user.save();
					res.json({ success: true, error: "no error" });
				}
			});
		}
	});
});

router.post("/docs/:docId/save", function(req, res) {
	let docId = req.params.docId;
	console.log("this is the doc id:", docId);
	let body = new Body({
		timestamp: new Date(),
		content: req.body.content,
	});

	Document.findOne({ _id: docId }, function(err, result) {
		if (err) {
			console.log(err);
			res.json({ success: false, error: err });
		}

		if (!err) {
			console.log(result);
			body.save();
			result.body.push(body);
			result.save(function(err, success) {
				if (err) {
					res.json({ success: false, error: err });
				}
				if (success) {
					console.log("successfully saved the updated document", result.body);
					res.json({ success: true, error: "" });
				}
			});
		}
	});
});

router.get("/docs", function(req, res) {
	Document.find({ owner: req.user._id }, function(err, result) {
		if (err) {
			console.log("json failure sent");
			res.json({ success: false, error: err, data: [] });
		}

		if (!err) {
			console.log("json success sent");
			res.json({ success: true, error: "", data: result });
		}
	});
});

router.get("/docs/:docId", function(req, res) {
	const docId = req.params.docId;
	Document.findOne({ _id: docId }, function(err, result) {
		if (err) {
			console.log(err);
			res.json({ success: false, error: err, data: null });
		}
		if (!err) {
			res.json({ success: true, error: "", data: result });
		}
	});
});

router.post("/docs/:docId/addCollab", function(req, res) {
	// let collaborator = req.body.collabId;
	let docId = req.params.docId;

	User.findOne({ username: req.body.username }, function(err, userToBeAdded) {
		if (userToBeAdded) {
			console.log("found user");
			const newUserId = userToBeAdded._id;
			Document.findOne({ _id: docId }, function(err, result) {
				if (err) {
					res.json({ success: false, error: err });
				}
				if (!err) {
					console.log(result);
					result.collaborators.push(newUserId);
					result.save(function(err, success) {
						if (err) {
							res.json({ success: false, error: err });
						}

						if (!err) {
							console.log("successfully added a collaborator");
							User.findOne({ _id: newUserId }, function(err, user) {
								if (err) {
									res.json({ success: false, error: err });
								}
								if (!err) {
									user.documents.push(result);
									user.save();
									res.json({ success: true, error: "" });
								}
							});
						}
					});
				}
			});
		}
	});
});

router.post("/docs/:docId/remCollab", function(req, res) {
	console.log(req.user);
	let collaborator = req.body.collabId;
	let docId = req.params.docId;
	Document.findOne({ _id: docId }, function(err, result) {
		if (err) {
			res.json({ success: false, error: err });
		}
		if (!err) {
			console.log("THIS IS THE OWNER", result.owner._id);
			if (collaborator == result.owner._id) {
				console.log("you are trying to remove owner from collabs");
				res.json({ success: false, error: "Cannot remove owner from collaborators" });
			}

			let jkl = result.collaborators.filter(col => col._id != collaborator);

			console.log("NEW RESULT", jkl);
			result.update({ collaborators: jkl }, function(err, success) {
				if (err) {
					res.json({ success: false, error: err });
				}

				if (!err) {
					console.log("successfully removed a collaborator");
					User.findOne({ _id: collaborator }, function(err, user) {
						if (err) {
							res.json({ sucess: false, error: err });
						}
						if (!err) {
							let docs = user.documents.filter(doc => doc._id != docId);
							console.log(user.documents);
							console.log("NEW DOCS", docs);
							user.update({ documents: docs }, function(err, res) {});
							res.json({ success: true, error: "" });
						}
					});
				}
			});
		}
	});
});

router.post("/docs/:docId/getBody", (req, res) => {
	const bodyId = req.body.bodyId;
	Body.findOne({ _id: bodyId }, (err, bod) => {
		if (err) {
			res.json({ sucess: false, error: err });
		} else {
			res.json({ sucess: true, error: "", data: bod });
		}
	});
});

router.get("/docs/:docId/allBodies", (req, res) => {
	const docId = req.params.docId;
	Document.findOne({ _id: docId })
		.populate("body")
		.exec((err, bods) => {
			if (err) {
				res.json({ sucess: false, error: err });
			} else {
				res.json({ sucess: true, error: "", data: bods });
			}
		});
});

module.exports = router;
