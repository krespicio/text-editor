import React from "react";
import ReactDOM from "react-dom";
import { FaAlignLeft, FaAlignRight, FaAlignCenter, FaSave, FaListOl, FaListUl } from "react-icons/fa";
import { Editor, EditorState, RichUtils, Modifier } from "draft-js";
import "../App.css"

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
		this.toggleColor = toggledColor => this._toggleColor(toggledColor);
		this.focus = () => this.editor.focus();
		this._onClick = e => {
			e.preventDefault();
			this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.name));
		};
	}

	_toggleColor(toggledColor) {
		const { editorState } = this.state;
		const selection = editorState.getSelection();
		// Let's just allow one color at a time. Turn off all active colors.
		const nextContentState = Object.keys(colorStyleMap).reduce((contentState, color) => {
			return Modifier.removeInlineStyle(contentState, selection, color);
		}, editorState.getCurrentContent());
		let nextEditorState = EditorState.push(
			editorState,
			nextContentState,
			"change-inline-style"
		);
		const currentStyle = editorState.getCurrentInlineStyle();
		// Unset style override for current color.
		if (selection.isCollapsed()) {
			nextEditorState = currentStyle.reduce((state, color) => {
				return RichUtils.toggleInlineStyle(state, color);
			}, nextEditorState);
		}
		// If the color is being toggled on, apply it.
		if (!currentStyle.has(toggledColor)) {
			nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggledColor);
		}
		this.onChange(nextEditorState);
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
		if (type === "ordered-list-item") {
			return "right-ordered-list-item";
		}
		if (type === "unordered-list-item") {
			return "unordered-list-item";
		}
	}

	styleWholeSelectedBlocksModifier(editorState, style, removeStyles) {
		let currentContent = editorState.getCurrentContent();
		let selection = editorState.getSelection();
		let finalContent = Modifier.setBlockType(currentContent, selection, style);
		this.onChange(EditorState.push(editorState, finalContent, "change-inline-style"));
	}

	// styleWholeSelectedBlocksModifier(editorState, style, removeStyles = []) {
	// 	let currentContent = editorState.getCurrentContent();
	// 	let selection = editorState.getSelection();
	// 	let focusBlock = currentContent.getBlockForKey(selection.getFocusKey());
	// 	let anchorBlock = currentContent.getBlockForKey(selection.getAnchorKey());
	// 	let selectionIsBackward = selection.getIsBackward();

	// 	let changes = {
	// 		anchorOffset: 0,
	// 		focusOffset: focusBlock.getLength(),
	// 	};

	// 	if (selectionIsBackward) {
	// 		changes = {
	// 			focusOffset: 0,
	// 			anchorOffset: anchorBlock.getLength(),
	// 		};
	// 	}

	// 	let selectWholeBlocks = selection.merge(changes);
	// 	let modifiedContent = Modifier.applyInlineStyle(currentContent, selectWholeBlocks, style);
	// 	let finalContent = removeStyles.reduce(function(content, style) {
	// 		return Modifier.removeInlineStyle(content, selectWholeBlocks, style);
	// 	}, modifiedContent);
	// 	this.onChange(EditorState.push(editorState, finalContent, "change-inline-style"));
	// }

	render() {
		const textStyles = ["BOLD", "ITALIC", "UNDERLINE", "CODE"];
		const paragraphStyles = [
			{ name: "LEFT", icon: <FaAlignLeft /> },
			{ name: "CENTER", icon: <FaAlignCenter /> },
			{ name: "RIGHT", icon: <FaAlignRight /> },
		];
		const listStyles = [
			{name: "ordered-list-item", icon: < FaListOl/>},
			{name: "unordered-list-item", icon: < FaListUl/>}
		]
		return (
			<div>
				<div style={styles.toolbar}>
					<ColorControls
						editorState={this.state.editorState}
						onToggle={this.toggleColor}
					/>
					{textStyles.map(style => (
						<button key={style} onMouseDown={this._onClick.bind(this)} name={style}>
							{style}
						</button>
					))}
					<button
						onClick={() =>
							this.styleWholeSelectedBlocksModifier(this.state.editorState, 'ordered-list-item')
						}>
						yeet
					</button>
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
					{listStyles.map(style => {
						return (
							<button
								key={style.name}
								onClick={() =>
									this.styleWholeSelectedBlocksModifier(
										this.state.editorState,
										style.name,
										listStyles.filter(a => a !== style.name)
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
						maxWidth: "100%",
						height: "80%",
						padding: "5px",
					}}>
					<Editor
						blockStyleFn={this.blockStyleFunc}
						editorState={this.state.editorState}
						onChange={this.onChange}
						handleKeyCommand={this.handleKeyCommand}
						customStyleMap={colorStyleMap}
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

class StyleButton extends React.Component {
	constructor(props) {
		super(props);
		this.onToggle = e => {
			e.preventDefault();
			this.props.onToggle(this.props.style);
		};
	}
	render() {
		let style;
		if (this.props.active) {
			style = { ...styles.styleButton, ...colorStyleMap[this.props.style] };
		} else {
			style = styles.styleButton;
		}
		return (
			<span style={style} onMouseDown={this.onToggle}>
				{this.props.label}
			</span>
		);
	}
}

var COLORS = [
	{ label: "Red", style: "red" },
	{ label: "Orange", style: "orange" },
	{ label: "Yellow", style: "yellow" },
	{ label: "Green", style: "green" },
	{ label: "Blue", style: "blue" },
	{ label: "Indigo", style: "indigo" },
	{ label: "Violet", style: "violet" },
];
const ColorControls = props => {
	var currentStyle = props.editorState.getCurrentInlineStyle();
	return (
		<div style={styles.controls}>
			{COLORS.map(type => (
				<div style={{ display: "inline-block", marginRight: "5px" }}>
					<StyleButton
						key={type.label}
						active={currentStyle.has(type.style)}
						label={type.label}
						onToggle={props.onToggle}
						style={type.style}
					/>
				</div>
			))}
		</div>
	);
};

const colorStyleMap = {
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
