import React, { Component } from "react";
import "./App.css";
import PartySystem, { Emitter } from "./PartySystem";

class App extends Component {
  render() {
    return (
      <div className="App">
        <PartySystem showGui={true} width={400} height={600} />
      </div>
    );
  }
}

export default App;
