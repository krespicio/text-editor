import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLogin, setIsLogin] = useState("");
	const [errorText, setErrorText] = useState("");

	const postLogin = async (e) => {
		e.preventDefault();
		const response = await fetch("http://localhost:5000/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		});
		const content = await response.json();
		console.log(content);
		if (!content.success) {
			setErrorText("Wrong username or password");
		} else {
			setIsLogin(true);
		}
	};

	if (isLogin) {
		console.log('LOGGED IN BITCH')
		return <h1>soiaefhoisefhiohefio</h1>
	} else {
		return (
			<div
				style={styles}>
				<h3 style={{ textAlign: "center" }}>Login</h3>
				{errorText && <p>{errorText}</p>}
				<form className="loginForm" onSubmit={e => postLogin(e)}>
					<div className="form-group row">
						<label className="col-sm-2 col-form-label">Username </label>
						<div className="col-sm-10">
							<input
								className="form-control"
								type="text"
								name="email"
								value={username}
								placeholder="username"
								onChange={e => setUsername(e.target.value)}
							/>
						</div>
					</div>
					<div class="form-group row">
						<label className="col-sm-2 col-form-label">Password </label>
						<div className="col-sm-10">
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
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<input
							style={{ width: "50%" }}
							type="submit"
							value="Login"
						/>
						<Link to="/signup" style={{ textAlign: "right" }}>
							SignUp Here!
						</Link>
					</div>
				</form>
			</div>
		);
	}
}

const styles = 
	{
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		display: "flex",
		flexDirection: "column",
	};