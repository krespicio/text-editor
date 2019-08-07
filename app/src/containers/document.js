import React from "react";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from "react-dom";
import EditingInterface from "../components/EditingInterface.js";
import { FaChevronLeft} from 'react-icons/fa';

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const response = await fetch("http://localhost:5000", {
      credentials: "include",
      mode: "cors",
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });
    console.log(response);
  }

  render() {
    return (
      <div style={styles.container} name="document" id="document">
        <div style={styles.content}>
          <div style={styles.portalButton}>

            <button color="secondary" size="sm">
              {" "}
              <Link to = "/portal">
              <FaChevronLeft /> Document Portal
              </Link>
            </button>

          </div>
          <div style={styles.title}>
            <h2> DOCUMENT TITLE HERE </h2>
          </div>
          <div style={styles.subtitle}>
            <h6> ID: DOCUMENT ID HERE </h6>
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
