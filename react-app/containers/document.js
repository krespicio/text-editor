import React from "react";
import ReactDOM from "react-dom";
import Toolbar from "../components/toolbar";
import Body from "../components/body";

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div
        style={{
          border: "1px solid black",
          backgroundColor: "grey",
          maxWidth: "90vw",
          display: "flex"
        }}
        name="document"
        id="document"
      >
        <Button variant="secondary" size="sm">
          {" "}
          Document Portal
        </Button>
        <h3> DOCUMENT TITLE HERE </h3>
        <h6> DOCUMENT ID HERE </h6>
        <Toolbar />
        <Body />
        <div style={{ justifyContent: "flex-end" }}>
          <Button variant="success" size="sm">
            {" "}
            Save Changes{" "}
          </Button>
        </div>
      </div>
    );
  }
}

export default Document;
