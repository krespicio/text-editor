const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// User Mongo
const { User } = require("../models");

function hashPassword(password) {
	let hash = crypto.createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}

module.exports = function(passport) {
	router.post("/signup", function (req, res) {
		console.log("in here to sign up dad");
		const newUser = new User({
				username: req.body.username,
				password: hashPassword(req.body.password),
				documents: []
			});
			console.log(newUser); 
			newUser.save(function(err, result) {
				console.log(err, result); 
				console.log('hiii');
				if (err) {
					console.log('we be erroring')
					res.json({success: false, error:err});
				}
				if (!err) {
					console.log('mama i made it')
					res.json({success: true, error: ''});
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
	});

	router.get("/login/failure", (req, res) => {
		res.json({ success: false });
	});

	//GET Logout page
	router.get("/logout", function(req, res) {
		req.logout();
		res.json({
			success: true,
			error: "",
		});
	});

	router.use((req, res, next) => {
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: "Not authorized",
			});
			return;
		}
		next();
	});

	return router;
};
