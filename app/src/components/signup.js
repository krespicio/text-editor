import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignup] = useState(false);

  const signup = e => {
    e.preventDefault();
    fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username,
        password
      })
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
			<div style={{backgroundColor: 'pink', display: 'flex', height: '100vh', alignItems: 'center'}}>
      <div style={styles.container}>
        <h3 style={{ textAlign: "center" }}>Sign Up</h3>
        <br />
        <form className="signupForm" onSubmit={e => signup(e)}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label className="col-sm-4 col-form-label">Username</label>
              <div className="col-sm-8">
                <input
                  className="form-control"
                  type="text"
                  name="username"
                  value={username}
                  placeholder="username"
                  onChange={e => setUsername(e.target.value)}
									style={{ width: "190px" }}
                />
              </div>
            </div>
              <div className="form-group col-md-6">
                <label className="col-sm-4 col-form-label">Password</label>
                <div className="col-sm-8">
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={password}
                    placeholder="password"
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
                <input
                  style={{ width: "30%", marginRight: "15px" }}
                  className="ghost-button"
                  type="submit"
                  value="Sign up!"
                />
                <Link to="/login">
									<Button variant = "secondary" size = "md">
                  Login Here!
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
		 backgroundImage: `url("https://media.giphy.com/media/xUPGcAq8idp4tCSMYE/giphy.gif")`,
 	  backgroundRepeat  : 'no-repeat',
 	  backgroundPosition: 'center',
	}
};
