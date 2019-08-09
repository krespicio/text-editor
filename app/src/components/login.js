import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState("");
  const [errorText, setErrorText] = useState("");

  const postLogin = async e => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify({
        username: username,
        password: password
      })
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
    console.log("LOGGED IN BITCH");
    return <Redirect to="/portal" />;
  } else {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          backgroundImage: `url("https://media.giphy.com/media/xUPGcAq8idp4tCSMYE/giphy.gif")`,
          backgroundPosition: "center"

        }}
      >
        <div style={styles.container}>
          <h3 style={{ textAlign: "center" }}>Login</h3>
          {errorText && <p>{errorText}</p>}
          <br />
          <form className="loginForm" onSubmit={e => postLogin(e)}>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label">Username </label>
              <div className="col-sm-8">
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
              <label className="col-sm-4 col-form-label">Password </label>
              <div className="col-sm-8">
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <input
                style={{ width: "30%" }}
                className="ghost-button"
                type="submit"
                value="Login"
              />

              <Link
                to="/signup"
                style={{ textAlign: "right", alignItems: "center" }}
              >
                <Button variant="secondary" size="md">
                  SignUp Here!
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    maxWidth: "50%",
    margin: "0 auto",
    border: "0.5px solid gray",
    borderRadius: "10px",
    padding: "30px",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "pink"
  }
};
