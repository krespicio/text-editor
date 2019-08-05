import React from "react";
import ReactDOM from "react-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import {Editor, EditorState, RichUtils} from 'draft-js';

class EditingInterface extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      editorState: EditorState.createEmpty()
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled"
    } 
    return "not handled"
  }

  render() {
    return (
      <div>

          {/* <button><FontAwesomeIcon icon={faCoffee} /></button> */}
    
        
        <div style={{border: '1px solid black', maxWidth: '80%', height: '80%'}}>
          <Editor editorState={this.state.editorState}
        onChange={this.onChange}
        handleKeyCommand={this.handleKeyCommand}/>
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
  },
  textbox: {
    border: '1px solid black',
    height: '200px',
    margin: '0 auto'
  }
 
}

export default EditingInterface;
