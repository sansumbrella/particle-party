import React, { Component } from "react";
import "./App.css";
import PartySystem, { Emitter } from "./PartySystem";

class App extends Component {
  render() {
    return (
      <div className="App">
        <PartySystem showGui={true} width={400} height={600}>
          <Emitter x={100} y={100} rate={60} />
        </PartySystem>
      </div>
    );
  }
}

export default App;
