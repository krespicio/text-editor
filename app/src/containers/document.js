import React from "react";
import ReactDOM from "react-dom";
import EditingInterface from "../components/EditingInterface";


class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        style={{
          display: "flex"
        }}
        name="document"
        id="document"
      >
        <div style={{ justifyContent: "flex-start" }}>
          <button variant="secondary" size="sm">
            {" "}
            Document Portal
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <h3> DOCUMENT TITLE HERE </h3>
        </div>
        <div>
          <h6> DOCUMENT ID HERE </h6>
        </div>
        <div>
          <EditingInterface />
        </div>
        <div style={{ justifyContent: "flex-end" }}>
          <button variant="success" size="sm">
            {" "}
            Save Changes{" "}
          </button>
        </div>
      </div>
    );
  }
}

export default Document;
