import React, { useState } from "react";

export default function History({ id }) {
	const [histories, setHistories] = useState([]);

	const getHistories = async () => {
		const link = "http://localhost:5000/docs/" + id + "/allBodies";
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
		console.log(responseJSON);
		setHistories(responseJSON);
	};

	return (
		<div>
			<h2>History</h2>
			<ul>
				{histories.map(history => (
					<li>{history.timestamp}</li>
				))}
			</ul>
		</div>
	);
}
