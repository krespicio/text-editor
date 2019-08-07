import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import EditingInterface from "../components/EditingInterface.js";
import { FaChevronLeft, FaRegUser } from "react-icons/fa";

class DocumentPortal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			docs: [],
		};
	}

	async componentDidMount() {
		const user = await fetch("http://localhost:5000/user", {
			method: "GET",
			credentials: "include",
			redirect: "follow",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const userJSON = await user.json();
		console.log("the user json is", userJSON.username);
		this.setCurrentUser(userJSON.username, userJSON.documents);
	}

	setCurrentUser(username, docs) {
		console.log("get current user is called");

		this.setState({
			username,
			docs,
		});

		this.getDocs();
	}

	getDocs() {
		console.log("We are converting the document");
	}

	logOut() {
		// I just want to make a request so that the server logs us out
		fetch("http://localhost:5000/user", {
			method: "GET",
		});
	}

	render() {
		return (
			<div style={styles.container} name="documentPortal" id="documentPortal">
				<div style={styles.content}>
					<div style={styles.user}>
						<span style={{ marginRight: "15px" }}>
							{" "}
							Welcome to your Portal, {this.state.user}{" "}
						</span>
						<button onClick={() => this.logOut()}>
							<Link to="/login">
								<FaRegUser />
								Log Out
							</Link>
						</button>
					</div>
					<input
						type="text"
						name="createDocument"
						placeholder="Enter Document Name Here"
						style={{ width: "200px" }}
					/>
					<button>Create Document</button>
					<br />
					<div style={styles.title}>
						<h2> Document Portal </h2>
					</div>
					<div style={styles.documentsBox}>
						<h3 style={styles.title}> My Documents </h3>
						<ul>
							{this.state.docs.map(doc => (
								<li>doc</li>
							))}
						</ul>
					</div>
					<input
						type="text"
						name="createSharedDocument"
						placeholder="Enter Document iD to be Shared Here"
						style={{ width: "200px" }}
					/>
					<button>Add Shared Document</button>
				</div>
			</div>
		);
	}
}

const styles = {
	container: {
		display: "flex",
		width: "90%",
		margin: "auto",
		padding: "10px",
	},
	content: {
		flex: 1,
		alignContent: "center",
	},
	title: { textAlign: "center" },
	subtitle: { textAlign: "left" },
	documentsBox: {
		border: "1px solid black",
		height: "200px",
		margin: "0 auto",
	},
	user: {
		textAlign: "right",
	},
};

export default DocumentPortal;
