import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import Document from "./containers/document.js";
import Login from "./components/login.js";
import EditingInterface from "./components/EditingInterface";
import Signup from "./components/signup.js";

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			endpoint: "http://localhost:5000",
		};
	}


  //     componentDidMount() {
  // 	  const socket = socketIOClient(this.state.endpoint);
  // 	  socket.on('save', )
  //     }

  //   render() {
  // 	const socket = socketIOClient(this.state.endpoint);
  //     return()
  //   }

  //   <Router>
  //     <Route exact path="/login" component={Login} />
  //     <Route exact path="/signup" component={Signup} />
  //     <Route exact path="/" component={Document} />
  //   </Router>

export default App;
