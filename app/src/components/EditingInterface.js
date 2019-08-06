import React from "react";
import ReactDOM from "react-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";

  // const styleMap = {
  //   'LEFT': {
  //     textAlign: "left"
  //   },
  //   'RIGHT': {
  //     textAlign: "right",
  //     backgroundColor: "red"
  //   },
  //   'CENTER': {
  //     textAlign: "center"
  //   }
  // }

class EditingInterface extends React.Component {
  constructor(props) {
    super(props);
    // this.editor = React.createRef();
    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.onChange = editorState => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this._onClick = e => {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, e.target.name)
      );
    };
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return "handled";
    }
    return "not handled";
  }

blockStyleFunc(contentBlock) {
  const type = contentBlock.getType();
  console.log(type);
  if (type === 'LEFT') {
    return 'left';
  }
  if (type === 'RIGHT') {
    return 'right';
  }
  if (type === 'CENTER') {
    return 'center';
  }
}

styleWholeSelectedBlocksModifier(editorState, style, removeStyles) {
  let currentContent = editorState.getCurrentContent();
  let selection = editorState.getSelection();
   let finalContent = Modifier.setBlockType(currentContent, selection, style);
   this.onChange(EditorState.push(editorState, finalContent, 'change-inline-style'));
}



  render() {
    const buttonStyles = ["BOLD", "ITALIC", "UNDERLINE", "CODE"];
    const paragraphStyles = ["LEFT", "RIGHT", "CENTER"];
    return (
      <div>
        <div style={styles.toolbar}>
          {buttonStyles.map(style => {
            return (
              <button key={style} onClick={this._onClick} name={style}>
                {style}
              </button>
            );
          })}
          {paragraphStyles.map(style => {
            return (
              <button key={style} onClick={() => this.styleWholeSelectedBlocksModifier(this.state.editorState, style, paragraphStyles.filter((a) => a !== style))} name={style}>
                {style}
              </button>
            );
          })}
        </div>

        <div
          style={{
            border: "1px solid black",
            maxWidth: "80%",
            height: "80%",
            padding: "5px"
          }}
        >
          <Editor
            blockStyleFn={this.blockStyleFunc}
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
          />
        </div>

        <div style={styles.saveButton}>
          <button variant="success" size="sm">
            Save Changes
          </button>
        </div>
      </div>
    );
  }
}

const styles = {
  saveButton: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    flexDirection: "row-reverse"
  },
  textbox: {
    border: "1px solid black",
    height: "200px",
    margin: "0 auto"
  },
  toolbar: {},

};

export default EditingInterface;
