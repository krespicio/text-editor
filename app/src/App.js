import React from "react";
import "./App.css";
import Document from "./containers/document.js";
import Login from "./components/login.js";

function App() {
	// <Router>
	// 	<Route path="/register" component={Login} />
	// 	{/* <Document /> */}
	// </Router>
	return <Login />;
}

export default App;
