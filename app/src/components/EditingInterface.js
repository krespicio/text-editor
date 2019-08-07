import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
  FaAlignLeft,
  FaAlignRight,
  FaAlignCenter,
  FaSave,
  FaListOl,
  FaListUl,
  FaBold,
  FaItalic,
  FaUnderline,
  FaEdge
} from "react-icons/fa";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import "../App.css";
import { Map } from "immutable";
import Dropdown from "react-bootstrap/Dropdown";
import socketIOClient from "socket.io-client";

class EditingInterface extends React.Component {
  constructor(props) {
    super(props);
    // this.editor = React.createRef();
    this.state = {
      editorState: EditorState.createEmpty(),
      bold: false,
      endpoint: "http://localhost:5000"
    };
    this.onChange = editorState => this.setState({ editorState });
    this.handleKeyCommand = this.handleKeyCommand.bind(this);

    this.focus = () => this.editor.focus();
    this._onClick = e => {
      //this is for the bold, italic...
      e.preventDefault();
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, e.target.name)
      );
      console.log(e.target.name);
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
    const alignment = contentBlock.getData().get("alignment");

    let style = [];
    // console.log(style);
    if (alignment === "LEFT") {
      style.push("left");
    }
    if (alignment === "RIGHT") {
      style.push("right");
    }
    if (alignment === "CENTER") {
      style.push("center");
    }
    if (type === "ordered-list-item") {
      style.push("ordered-list-item");
    }
    if (type === "unordered-list-item") {
      style.push("unordered-list-item");
    }

    let stringStyle = style.join(" ");
    console.log(stringStyle);
    return stringStyle;
  }

  styleWholeSelectedBlocksModifier(editorState, style) {
    let currentContent = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let finalContent = Modifier.setBlockType(currentContent, selection, style);
    this.onChange(
      EditorState.push(editorState, finalContent, "change-inline-style")
    );
  }

  styleParagraphs(editorState, style) {
    let currentContent = editorState.getCurrentContent();
    let selection = editorState.getSelection();
    let finalContent = Modifier.mergeBlockData(
      currentContent,
      selection,
      Map({
        alignment: style
      })
    );
    this.onChange(
      EditorState.push(editorState, finalContent, "change-inline-style")
    );
  }

  render() {
    const textStyles = [
      { name: "BOLD", icon: <FaBold /> },
      { name: "ITALIC", icon: <FaItalic /> },
      { name: "UNDERLINE", icon: <FaUnderline /> },
      { name: "CODE", icon: <FaEdge /> }
    ];
    const paragraphStyles = [
      { name: "LEFT", icon: <FaAlignLeft /> },
      { name: "CENTER", icon: <FaAlignCenter /> },
      { name: "RIGHT", icon: <FaAlignRight /> }
    ];
    const colorStyles = [
      "Red",
      "Orange",
      "Yellow",
      "Green",
      "Blue",
      "Indigo",
      "Violet"
    ];
    const fontStyles = ["Small", "Medium", "Large"];
    const listStyles = [
      { name: "ordered-list-item", icon: <FaListOl /> },
      { name: "unordered-list-item", icon: <FaListUl /> }
    ];

    return (
      <div>
        <div style={styles.toolbar}>
          <div id="dropdowns" style={{ flex: 1 }}>
            <Dropdown style={{ display: "inline-block" }}>
              <Dropdown.Toggle
                id="dropdown-basic"
                size="sm"
                variant="secondary"
              >
                {" "}
                Font Size{" "}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {fontStyles.map(style => (
                  <Dropdown.Item
                    eventKey={style}
                    name={style}
                    onClick={this._onClick.bind(this)}
                  >
                    {style}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown style={{ display: "inline-block" }}>
              <Dropdown.Toggle
                id="dropdown-basic"
                size="sm"
                variant="secondary"
              >
                {" "}
                Font Color{" "}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {colorStyles.map(style => (
                  <Dropdown.Item
                    key={style}
                    onMouseDown={this._onClick.bind(this)}
                    name={style}
                  >
                    {style}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div id="other buttons" style={{ justifyContent: "flex-end" }}>
            {textStyles.map(style => (
              <button
                key={style.name}
                onMouseDown={this._onClick.bind(this)}
                name={style.name}
              >
                {style.icon}
              </button>
            ))}

            {paragraphStyles.map(style => {
              return (
                <button
                  key={style.name}
                  onClick={() =>
                    this.styleParagraphs(this.state.editorState, style.name)
                  }
                  name={style.name}
                >
                  {style.icon}
                </button>
              );
            })}
            {listStyles.map(style => (
              <button
                key={style.name}
                onClick={() =>
                  this.styleWholeSelectedBlocksModifier(
                    this.state.editorState,
                    style.name
                  )
                }
                name={style.name}
              >
                {style.icon}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            border: "1px solid black",
            height: "80%",
            padding: "5px",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Editor
            blockStyleFn={this.blockStyleFunc}
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            ref={Editor => Editor && Editor.focus()}
            customStyleMap={styleMap}
          />
        </div>

        <div style={styles.saveButton}>
          <button variant="success" size="sm">
            <FaSave />
            Save Changes
          </button>
        </div>
      </div>
    );
  }
}

const styleMap = {
  Red: {
    color: "rgba(255, 0, 0, 1.0)"
  },
  Orange: {
    color: "rgba(255, 127, 0, 1.0)"
  },
  Yellow: {
    color: "rgba(225, 217, 4, 1.0)"
  },
  Green: {
    color: "rgba(0, 180, 0, 1.0)"
  },
  Blue: {
    color: "rgba(0, 0, 255, 1.0)"
  },
  Indigo: {
    color: "rgba(75, 0, 130, 1.0)"
  },
  Violet: {
    color: "rgba(127, 0, 255, 1.0)"
  },
  Small: {
    fontSize: "10px"
  },
  Medium: {
    fontSize: "20px"
  },
  Large: {
    fontSize: "30px"
  }
};

const styles = {
  saveButton: {
    justifyContent: "flex-end",
    alignContent: "flex-end",
    flexDirection: "row-reverse"
  },
  textbox: {
    border: "1px solid black",
    height: "200px",
    margin: "0 auto",
    maxWidth: "900px"
  },
  controls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: 14,
    marginBottom: 10,
    userSelect: "none"
  },
  toolbar: {
    backgroundColor: "rgba(110, 117, 124, 1.0)",
    display: "flex",
    justifyContent: "space-around"
  }
};

export default EditingInterface;
