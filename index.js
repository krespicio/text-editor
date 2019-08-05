const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const crypto = require("crypto");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./routes/Auth");
// Import Model

const app = express();

// Import the Routes

// Ensure there is a pasword
if (!process.env.SECRET) {
	console.log("Error: no secret");
	process.exit(1);
}

// Middleware Protocols
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(newsRouter);
app.use(statsRoute);

// Passport stuff
app.use(
	session({
		secret: process.env.SECRET,
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie: {
			httpOnly: true,
			secure: false,
		},
	})
);

function hashPassword(password) {
	let hash = crypto.createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}

passport.serializeUser(function(user, done) {
	done(null, user._id);
});
passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

passport.use(
	new LocalStrategy(function(username, password, done) {
		// Find the user with the given username
		User.findOne({ username: username }, function(err, user) {
			// if there's an error, finish trying to authenticate (auth failed)
			if (err) {
				// console.log(err);
				return done(err);
			}
			// if no user present, auth failed
			if (!user) {
				// console.log(user);
				return done(null, false);
			}
			// if passwords do not match, auth failed
			if (user.password !== hashPassword(password)) {
				return done(null, false);
			}
			// auth has has succeeded
			return done(null, user);
		});
	})
);

// ji

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", auth(passport));
app.use(newsRouter);
app.use(statsRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.get("/", (req, res) => {
	res.send("hi");
});

module.exports = app;
