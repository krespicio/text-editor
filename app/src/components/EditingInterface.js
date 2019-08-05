import React from "react";
import ReactDOM from "react-dom";

class EditingInterface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      input: ''
    }
  }

  render() {
    return (
      <div>
        <div>
          <textarea type="text" onChange={(e) => this.setState({input: e.target.value})}>
          </textarea>
        </div>
        <div style={styles.saveButton}>
          <button variant="success" size="sm">
            Save Changes
          </button>
        </div>
      </div>
    )
  }
}

const styles = {
  saveButton:{
    justifyContent: "flex-end",
    alignContent: "flex-end",
    flexDirection: "row-reverse"
  }
}

export default EditingInterface;
