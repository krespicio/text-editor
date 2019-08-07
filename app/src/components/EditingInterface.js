import React from "react";
import ReactDOM from "react-dom";
import {
	FaAlignLeft,
	FaAlignRight,
	FaAlignCenter,
	FaSave,
	FaListOl,
	FaListUl,
} from "react-icons/fa";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import "../App.css";

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
		if (type === "LEFT") {
			return "left";
		}
		if (type === "RIGHT") {
			return "right";
		}
		if (type === "CENTER") {
			return "center";
		}
		if (type === "OL") {
			return "ordered-list-item";
		}
		if (type === "UL") {
			return "unordered-list-item";
		}
	}

	styleWholeSelectedBlocksModifier(editorState, style, removeStyles) {
		let currentContent = editorState.getCurrentContent();
		let selection = editorState.getSelection();
		let finalContent = Modifier.setBlockType(currentContent, selection, style);
		this.onChange(EditorState.push(editorState, finalContent, "change-inline-style"));
	}

	render() {
		const textStyles = ["BOLD", "ITALIC", "UNDERLINE", "CODE"];
		const paragraphStyles = [
			{ name: "LEFT", icon: <FaAlignLeft /> },
			{ name: "CENTER", icon: <FaAlignCenter /> },
			{ name: "RIGHT", icon: <FaAlignRight /> },
		];
		const colorStyles = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
		const fontStyles = ["small", "medium", "large"];

		return (
			<div>
				<div style={styles.toolbar}>
					{colorStyles.map(style => (
						<button key={style} onMouseDown={this._onClick.bind(this)} name={style}>
							{style}
						</button>
					))}

					{fontStyles.map(style => (
						<button key={style} onMouseDown={this._onClick.bind(this)} name={style}>
							{style}
						</button>
					))}

					{textStyles.map(style => (
						<button key={style} onMouseDown={this._onClick.bind(this)} name={style}>
							{style}
						</button>
					))}
					{paragraphStyles.map(style => {
						return (
							<button
								key={style.name}
								onClick={() =>
									this.styleWholeSelectedBlocksModifier(
										this.state.editorState,
										style.name,
										paragraphStyles.filter(a => a !== style.name)
									)
								}
								name={style.name}>
								{style.icon}
							</button>
						);
					})}
				</div>

				<div
					style={{
						border: "1px solid black",
						maxWidth: "750px",
						height: "80%",
						padding: "5px",
					}}>
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
	red: {
		color: "rgba(255, 0, 0, 1.0)",
	},
	orange: {
		color: "rgba(255, 127, 0, 1.0)",
	},
	yellow: {
		color: "rgba(180, 180, 0, 1.0)",
	},
	green: {
		color: "rgba(0, 180, 0, 1.0)",
	},
	blue: {
		color: "rgba(0, 0, 255, 1.0)",
	},
	indigo: {
		color: "rgba(75, 0, 130, 1.0)",
	},
	violet: {
		color: "rgba(127, 0, 255, 1.0)",
	},
	small: {
		fontSize: "10px",
	},
	medium: {
		fontSize: "20px",
	},
	large: {
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
		height: "200px",
		margin: "0 auto",
	},
	controls: {
		fontFamily: "'Helvetica', sans-serif",
		fontSize: 14,
		marginBottom: 10,
		userSelect: "none",
	},
};

export default EditingInterface;
