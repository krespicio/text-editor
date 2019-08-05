import React from "react";
import ReactDOM from "react-dom";

class EditingInterface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div>
        <div></div>
        <div>
          <textarea>
            <input type="text" onChange={(e) => this.setState(e.target.value)}></input>
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

class Body extends React.Component {
  render(){
    
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
