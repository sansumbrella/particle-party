import React, { Component } from "react";
import "./App.css";
import PartySystem, { Emitter } from "./PartySystem";

class App extends Component {
  render() {
    return (
      <div className="App">
        <PartySystem
          showGui={true}
          width={400}
          height={600}
          emitters={[
            new Emitter({ x: 100, y: 100 }),
            new Emitter({ x: 200, y: 400 })
          ]}
        />
      </div>
    );
  }
}

export default App;
