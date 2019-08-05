import React from "react";
import ReactDOM from "react-dom";
import EditingInterface from "../components/EditingInterface.js";

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div style={styles.container} name="document" id="document">
        <div style={styles.content}>
          <div style={styles.portalButton}>
            <button variant="secondary" size="sm">
              {" "}
              Document Portal
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
    margin: "auto"
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
