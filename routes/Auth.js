const express = require("express");
const router = express.Router();
const crypto = require("crypto");

// User Mongo
const models = require("../models");
const User = models.User;

function hashPassword(password) {
	let hash = crypto.createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}

module.exports = function(passport) {
	router.post("/signup", async (req, res) => {
		console.log("in here to sign up dad");
		const found = await User.findOne({ username: req.body.username }, (err, user) => {
			if (!err && user) {
				return user;
			}
		});
		if (!found) {
			const newUser = new User({
				username: req.body.username,
				password: hashPassword(req.body.password),
			});
			newUser.save(() => console.log("bitch we saved"));
			res.send({ success: true, error: "none" });
		} else {
			res.send({ success: false, error: "there is an existing user silly billy" });
		}
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
