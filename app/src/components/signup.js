import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

export default function Signup() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isSignUp, setIsSignup] = useState(false);

	const signup = e => {
		e.preventDefault();
		fetch("http://localhost:5000/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify({
				username,
				password,
			}),
		})
			.then(response => response.json())
			.then(responseJson => {
				console.log(responseJson);
				if (responseJson.success) {
					setIsSignup(true);
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	if (isSignUp) {
		return <Redirect to="/login" />;
	} else {
		return (
			<div style={styles}>
				<h3 style={{ textAlign: "center" }}>Register</h3>
				<form className="signupForm" onSubmit={e => signup(e)}>
					<div className="form-row">
						<div className="form-group col-md-6">
							<label>Username</label>
							<input
								className="form-control"
								type="text"
								name="username"
								value={username}
								placeholder="username"
								onChange={e => setUsername(e.target.value)}
							/>
						</div>
						<div className="form-group col-md-6">
							<label>Password</label>
							<input
								className="form-control"
								type="password"
								name="password"
								value={password}
								placeholder="password"
								onChange={e => setPassword(e.target.value)}
							/>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

const styles = {
	justifyContent: "center",
	alignItems: "center",
	height: "100%",
	display: "flex",
	flexDirection: "column",
};
