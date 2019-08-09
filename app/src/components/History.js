import React, { useState, useEffect } from "react";
import axios from "axios";

export default function History(props) {
	const [histories, setHistories] = useState([]);

	const doTheThing = async () => {
		const link = "http://localhost:5000/docs/" + props.id + "/allBodies";
		const response = await fetch(link, {
			credentials: "include",
			mode: "cors",
			method: "GET",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});
		const responseJSON = await response.json();
		console.log("this is the:", responseJSON);
		if (responseJSON.sucess) {
			const bodies = responseJSON.data.body;
			// console.log("Here are the bodies", bodies);
			setHistories(bodies);
			console.log("this is in the thing", bodies);
		}
	};

	const handleClick = time => {
		console.log(time);
	};

	// useEffect(async () => {});

	return (
		<div>
			<button onClick={doTheThing}>Show hist</button>
			<h2>History</h2>
			<ul>
				{histories.reverse().map(history => (
					<li className={"bepper"} onClick={() => handleClick(history.timestamp)}>
						{history.timestamp}
					</li>
				))}
			</ul>
		</div>
	);
}
