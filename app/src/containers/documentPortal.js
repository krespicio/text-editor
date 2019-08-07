import React from "react";
import ReactDOM from "react-dom";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import EditingInterface from "../components/EditingInterface.js";
import { FaChevronLeft, FaRegUser } from "react-icons/fa";
import socketIOClient from "socket.io-client";

class DocumentPortal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: "Decadence",
			endpoint: "http://localhost:5000", //socket stuff
			documents: [] //added documents
		};
	}

	componentDidMount(){ //idk what this does but it might be useful later?
		const socket = socketIOClient(this.state.endpoint);
	}

	async getCurrentUser() {
		const user = await fetch("http://localhost:5000/:userId", {
			method: "GET",
			credentials: "include",
			redirect: "follow",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const userJSON = await user.json();
		console.log(userJSON);
		this.setState({
			user: userJSON.data.name; //name of the user
		})
	}

	async getDocuments() { //gets the documents of the user
		const documents = await fetch("http://localhost:5000/:userId/docs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const documentsJSON = await documents.json();
		this.setState({documents: documentsJSON.data})
	}

	openDocument(docId) { //function called when user clicks on document name
		const socket = socketIOClient(this.state.endpoint);
		socket.emit('enterRoom', docId);
	}

	render() {
		this.getCurrentUser();
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
						{this.state.documents.map((doc) => { //shows list of document names
							let link = `http://localhost:3000/docs/${doc._id}`
							<a href={link}><button onClick={() => this.openDocument(doc._id)}>{doc.title}</button></a>
						})}
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
