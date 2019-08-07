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
const { User, Session } = require("./models");
const auth = require("./routes/Auth");
const docRoutes = require("./routes/docRoutes");

const app = express();

const REQUIRED_ENVS = ["MONGODB_URI"];

REQUIRED_ENVS.forEach(function(el) {
	if (!process.env[el]) throw new Error("Missing required env var " + el);
});
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("open", () => console.log(`Connected to MongoDB!`));
mongoose.connection.on("error", function(err) {
	console.log("Mongoose default connection error: " + err);
});

// Ensure there is a pasword
if (!process.env.SECRET) {
	console.log("Error: no secret");
	process.exit(1);
}

// Middleware Protocols
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

// Passport stuff

app.use(
	session({
		secret: process.env.SECRET,
		cookie: { secure: false, maxAge: 3600000 },
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		// saveUninitialized: true,
		//resave: true,
	})
);

function hashPassword(password) {
	let hash = crypto.createHash("sha256");
	hash.update(password);
	return hash.digest("hex");
}

passport.serializeUser(function(user, done) {
	console.log("serializeUser", user, user._id);
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log("deserializeUser", id);
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
				console.log(err);
				return done(err);
			}
			// if no user present, auth failed
			if (!user) {
				console.log(user);
				return done(null, false);
			}
			// if passwords do not match, auth failed
			if (user.password !== hashPassword(password)) {
				return done(null, false);
			}
			// auth has has succeeded
			// console.log('we good', user);
			return done(null, user);
		});
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", auth(passport));
app.use("/", docRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
