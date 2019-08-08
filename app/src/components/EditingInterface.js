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
    FaEdge,
} from "react-icons/fa";
import { Editor, EditorState, RichUtils, Modifier, convertToRaw, convertFromRaw } from "draft-js";
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
        };
        this.onChange = editorState => this.setState({ editorState });
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.focus = () => this.editor.focus();
        this._onClick = e => {
            //this is for the bold, italic...
            e.preventDefault();
            this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.name));
            // console.log(e.target.name);
        };
				this._onBoldClick = e => {
      e.preventDefault();
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
      );
    };
		this._onItalicClick = e => {
      e.preventDefault();
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
      );
    };
		this._onUnderlineClick = e => {
      e.preventDefault();
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
      );
    };
		this._onCodeClick = e => {
      e.preventDefault();
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "CODE")
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
        this.onChange(EditorState.push(editorState, finalContent, "change-inline-style"));
    }

    styleParagraphs(editorState, style) {
        let currentContent = editorState.getCurrentContent();
        let selection = editorState.getSelection();
        let finalContent = Modifier.mergeBlockData(
            currentContent,
            selection,
            Map({
                alignment: style,
            })
        );
        this.onChange(EditorState.push(editorState, finalContent, "change-inline-style"));
    }

    async componentDidMount(props) {
        this.loadPrevious();
        console.log("These are props things", this.state.props);
    }

    async loadPrevious() {
        const link = "http://localhost:5000/docs/" + this.props.id + "/getBody";
        console.log("this is in load previous:", this.props.id);
        console.log("you might be a dumby?:", this.props.bodyId);

        const response = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            credentials: "include",
            body: JSON.stringify({
                bodyId: this.props.bodyId,
            }),
        });
        const responseJSON = await response.json();
        if (responseJSON.data) {
            const rawContent = responseJSON.data.content;
            const parsedContent = JSON.parse(rawContent);
            console.log(parsedContent);
            this.setState({
                editorState: EditorState.createWithContent(convertFromRaw(parsedContent)),
            });
        }
    }

    async handleSave() {
        const link = "http://localhost:5000/docs/" + this.props.id + "/save";
        console.log(this.props);
        const contentState = this.state.editorState.getCurrentContent();
        const content = JSON.stringify(convertToRaw(contentState));
        console.log(content);
        console.log(link);
        const response = await fetch(link, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            credentials: "include",
            body: JSON.stringify({
                content,
            }),
        });
        // const responseJSON = await response.json();
        // console.log(responseJSON);
        console.log(await response.text());
    }

    render() {
        const paragraphStyles = [
            { name: "LEFT", icon: <FaAlignLeft /> },
            { name: "CENTER", icon: <FaAlignCenter /> },
            { name: "RIGHT", icon: <FaAlignRight /> },
        ];
        const colorStyles = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet"];
        const fontStyles = ["Small", "Medium", "Large"];
        const listStyles = [
            { name: "ordered-list-item", icon: <FaListOl /> },
            { name: "unordered-list-item", icon: <FaListUl /> },
        ];
        return (
            <div>
                <div style={styles.toolbar}>
                    <div id="dropdowns" style={{ flex: 1 }}>
                        <Dropdown style={{ display: "inline-block" }}>
                            <Dropdown.Toggle id="dropdown-basic" size="sm" variant="secondary">
                                {" "}
                                Font Size{" "}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {fontStyles.map(style => (
                                    <Dropdown.Item
                                        eventKey={style}
                                        name={style}
                                        onMouseDown={this._onClick.bind(this)}>
                                        {style}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown style={{ display: "inline-block" }}>
                            <Dropdown.Toggle id="dropdown-basic" size="sm" variant="secondary">
                                {" "}
                                Font Color{" "}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {colorStyles.map(style => (
                                    <Dropdown.Item
                                        key={style}
                                        onMouseDown={this._onClick.bind(this)}
                                        name={style}>
                                        {style}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div id="other buttons" style={{ justifyContent: "flex-end" }}>
										<button
					key={"BOLD"}
					onMouseDown={this._onBoldClick.bind(this)}
					name={"BOLD"}
				>
					<FaBold />
				</button>
				<button
					key={"UNDERLINE"}
					onMouseDown={this._onUnderlineClick.bind(this)}
					name={"UNDERLINE"}
				>
					<FaUnderline />
				</button>
				<button
					key={"ITALIC"}
					onMouseDown={this._onItalicClick.bind(this)}
					name={"ITALIC"}
				>
					<FaItalic />
				</button>
				<button
					key={"CODE"}
					onMouseDown={this._onCodeClick.bind(this)}
					name={"CODE"}
				>
					<FaEdge />
				</button>



                        {paragraphStyles.map(style => {
                            return (
                                <button
                                    key={style.name}
                                    onMouseDown={() =>
                                        this.styleParagraphs(this.state.editorState, style.name)
                                    }
                                    name={style.name}>
                                    {style.icon}
                                </button>
                            );
                        })}
                        {listStyles.map(style => (
                            <button
                                key={style.name}
                                onMouseDown={() =>
                                    this.styleWholeSelectedBlocksModifier(
                                        this.state.editorState,
                                        style.name
                                    )
                                }
                                name={style.name}>
                                {style.icon}
                            </button>
                        ))}
                    </div>
                </div>
                <div style={styles.textbox}>
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
                    <button
                        variant="success"
                        size="sm"
                        onClick={this.handleSave.bind(this, this.props)}>
                        <FaSave />
                        Save Changes
                    </button>
                    <button
                        variant="success"
                        size="sm"
                        onClick={this.loadPrevious.bind(this, this.props)}>
                        <FaSave />
                        Load
                    </button>
                </div>
            </div>
        );
    }
}

const styleMap = {
    Red: {
        color: "rgba(255, 0, 0, 1.0)",
    },
    Orange: {
        color: "rgba(255, 127, 0, 1.0)",
    },
    Yellow: {
        color: "rgba(225, 217, 4, 1.0)",
    },
    Green: {
        color: "rgba(0, 180, 0, 1.0)",
    },
    Blue: {
        color: "rgba(0, 0, 255, 1.0)",
    },
    Indigo: {
        color: "rgba(75, 0, 130, 1.0)",
    },
    Violet: {
        color: "rgba(127, 0, 255, 1.0)",
    },
    Small: {
        fontSize: "10px",
    },
    Medium: {
        fontSize: "20px",
    },
    Large: {
        fontSize: "30px",
    },
};

const styles = {
    saveButton: {
        justifyContent: "flex-end",
        alignContent: "flex-end",
        flexDirection: "row-reverse",
    },
    textbox: {
        border: "1px solid black",
        height: "80%",
        padding: "5px",
        alignItems: "center",
        justifyContent: "center",
    },
    controls: {
        fontFamily: "'Helvetica', sans-serif",
        fontSize: 14,
        marginBottom: 10,
        userSelect: "none",
    },
    toolbar: {
        backgroundColor: "rgba(110, 117, 124, 1.0)",
        display: "flex",
        justifyContent: "space-around",
    },
};

export default EditingInterface;
