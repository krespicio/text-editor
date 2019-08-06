import React from "react";
import ReactDOM from "react-dom";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { Editor, EditorState, RichUtils, getCurrentInlineStyle } from "draft-js";

class EditingInterface extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
		};
		this.onChange = editorState => this.setState({ editorState });
		this.handleKeyCommand = this.handleKeyCommand.bind(this);
		this._onClick = e => {
			e.preventDefault();
			let frog = this.state.editorState.getCurrentInlineStyle();
			console.log(e.target.name, frog);
			this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, e.target.name));
		};
	}

	toggleBlockType(blockType) {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
	}

	handleKeyCommand(command, editorState) {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return "handled";
		}
		return "not handled";
	}

	// toggleBulletPoints() {
	// 	this.onChange(RichUtils.toggleBlockType(this.state.editorState, "unordered-list-item"));
	// }

	render() {
		const buttonStyles = ["BOLD", "ITALIC", "UNDERLINE", "CODE"];
		return (
			<div>
				<div style={styles.toolbar}>
					{buttonStyles.map(style => {
						return (
							<button key={style} onMouseDown={this._onClick.bind(this)} name={style}>
								{style}
							</button>
						);
					})}
					<button onClick={this.toggleBulletPoints}>Bullet points</button>
				</div>

				<div
					style={{
						border: "1px solid black",
						maxWidth: "80%",
						height: "80%",
						padding: "5px",
					}}>
					<Editor
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
		flexDirection: "row-reverse",
	},
	textbox: {
		border: "1px solid black",
		height: "200px",
		margin: "0 auto",
	},
	toolbar: {},
};

export default EditingInterface;
