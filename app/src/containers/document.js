import React from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import EditingInterface from "../components/EditingInterface.js";
import History from "../components/History.js";
import { FaChevronLeft } from "react-icons/fa";
import socketIOClient from "socket.io-client";

class Document extends React.Component {
	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			documentId: "",
			documentTitle: "",
			password: "",
			ownerId: "",
			body: [],
			collaborators: [],
			endpoint: "http://localhost:5000",
			showInterface: false,
		};
	}

	async componentDidMount() {
		const responseNoJson = await fetch(
			`http://localhost:5000/docs/${this.props.match.params.docId}`,
			{
				credentials: "include",
				mode: "cors",
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}
		);
		const response = await responseNoJson.json();
		this.setState({
			documentId: response.data._id,
			documentTitle: response.data.title,
			password: response.data.password,
			ownerId: response.data.owner,
			body: response.data.body,
			collaborators: response.data.collaborators,
			showInterface: true,
		});

		const socket = socketIOClient(this.state.endpoint);
		socket.emit("enterRoom", this.state.documentId);
	}

	setDocProps(response) {
		this.setState({
			documentId: response._id,
			documentTitle: response.title,
			password: response.password,
			ownerId: response.owner,
			body: response.body,
			collaborators: response.collaborators,
			showInterface: true,
		});
	}

	async shareDoc() {
		const username = prompt("Enter the collaborator's name");
		console.log(this.state.documentId);

		const link = "http://localhost:5000/docs/" + this.state.documentId + "/addCollab";
		const response = await fetch(link, {
			credentials: "include",
			mode: "cors",
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
			}),
		});
		const responseJson = await response.json();
		console.log(responseJson);
	}

	render() {
		return (
			<div style={styles.container} name="document" id="document">
				<div style={styles.content}>
					<div style={styles.portalButton}>
						<button color="secondary" size="sm">
							{" "}
							<Link to="/portal">
								<FaChevronLeft /> Document Portal
							</Link>
						</button>
						<button onClick={this.shareDoc.bind(this)}>Share this Document</button>
					</div>
					<div style={styles.title}>
						<h2> {this.state.documentTitle} </h2>
					</div>
					<div style={styles.subtitle}>
						<h6> ID: {this.state.documentId} </h6>
					</div>
					<div>
						{this.state.showInterface && (
							<EditingInterface
								id={this.state.documentId}
								bodyId={this.state.body[this.state.body.length - 1]}
							/>
						)}
					</div>
					{/* <History id={this.state.documentId} /> */}
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
	portalButton: { justifyContent: "flex-start" },
	title: { textAlign: "center" },
	subtitle: { textAlign: "left" },
};

export default Document;
