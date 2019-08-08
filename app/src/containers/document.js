import React from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import EditingInterface from "../components/EditingInterface.js";
import { FaChevronLeft } from "react-icons/fa";

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentId: "",
      documentTitle: "",
      password: "",
      ownerId: "",
      body: [],
      collaborators: []
    };
  }

  async componentDidMount() {
    const responseNoJson = await fetch("http://localhost:5000", {
      credentials: "include",
      mode: "cors",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const response = await responseNoJson.json();
    this.setState({
      documentId: response._id,
      documentTitle: response.title,
      password: response.password,
      ownerId: response.owner,
      body: response.body,
      collaborators: response.collaborators
    });
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
          </div>
          <div style={styles.title}>
            <h2> {this.state.documentTitle} </h2>
          </div>
          <div style={styles.subtitle}>
            <h6> ID: {this.state.documentId} </h6>
          </div>
          <div>
            <EditingInterface />
          </div>
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
    padding: "10px"
  },
  content: {
    flex: 1,
    alignContent: "center"
  },
  portalButton: { justifyContent: "flex-start" },
  title: { textAlign: "center" },
  subtitle: { textAlign: "left" }
};

export default Document;
