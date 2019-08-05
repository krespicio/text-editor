import React, {useState} from "react"; 
import { Link, Redirect} from "react-router-dom"; 

function Login() {
    const [username, setUsername] = useState(""); 
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(""); 


    function login(e) {
        e.preventDefault(); 
        setIsLogin(true); 

    }

    if (isLogin) { 
        return <Redirect to = "/"> </Redirect>
    }
    else {
        return (
            <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}
      > 
       <h3 style={{ textAlign: "center" }}>Login</h3>
        <form className="loginForm" onSubmit={e => login(e)}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Email </label>
            <div className="col-sm-10">
              <input
                className="form-control"
                type="text"
                name="email"
                value={email}
                placeholder="email"
                onChange={e => setEmail(e.target.value)}
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
          <div style={{display:"flex", justifyContent:"space-between"}}>
          <input className="ghost-button" style={{ width: "20%" }} type="submit" value="Login" />
            <Link to="/signup" style={{textAlign:"right"}}>SignUp Here!</Link>
          </div>
            
        </form>
      </div>
        )

    }






}