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
		User.findOne({username: req.body.username}, function(err, user){
			if (!user) {
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
			}

			if (user) {
				console.log('user already exists'); 
				res.json({success: true, error: ""}); 
			}
		})
		
		
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
		res.json({ success: true, login: "yeet" });
		console.log("success", req.user, req.session.user);

		return;
	});

	router.get("/login/failure", (req, res) => {
		res.json({ success: false });
		return;
	});

	router.get("/user", async (req, res) => {
		if (req.user) {
			console.log("call of the user", req.user._id);
			// return res.json(req.user);
			const user = await User.findOne({ _id: req.user._id })
				.populate("documents")
				.exec((err, user) => {
					console.log(user);
					if (user) {
						return res.json(user);
					}
				});
		}
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
		// console.log("cookies", req.cookies, req.session);

		// console.log("This is the user in the use", req.user);
		if (!req.user) {
			res.status(401).json({
				success: false,
				error: "Not authorized",
			});
			return;
		}
		next();
	});

	// router.post("/user", (req, res) => {
	// 	res.json({ success: true });
	// });

	return router;
};
