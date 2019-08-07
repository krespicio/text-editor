const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},
	documents: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Document",
			required: false,
		},
	],
});

var documentSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
	},
	collaborators: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
	],
	body: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Body",
		},
	],
});

var bodySchema = new Schema({
	timestamp: {
		type: Date,
		required: true,
	},
	content: {
		type: String,
	},
});

const User = mongoose.model("User", userSchema);
const Document = mongoose.model("Document", documentSchema);
const Body = mongoose.model("Body", bodySchema);

module.exports = {
	User,
	Document,
	Body,
};
