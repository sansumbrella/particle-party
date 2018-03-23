import React, { Fragment, Component } from "react";
import { Record } from "immutable";

class Particle extends Record({
  age: 0,
  individuality: Math.random(),
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
}) {}

const particleUpdate = (particle, dt) => {
  return particle.withMutations(p => {
    p.vy += 0.5; // gravity
    p.vy *= 0.95; // drag
    p.vx *= 0.95;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.age += dt;
  });
};

const particleIsAlive = particle => {
  return particle.age < 3;
};

export default class PartySystem extends Component {
  constructor(props) {
    super(props);

    this.particles = [];
    for (let i = 0; i < 20; i += 1) {
      this.particles.push(
        new Particle({
          x: 200,
          y: 200,
          vx: (0.5 - Math.random()) * 10,
          vy: -10
        })
      );
    }
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    this.context = canvas.getContext("2d");
    this.draw();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameRequest);
  }

  render() {
    return (
      <Fragment>
        ¡Hello, party person!
        <canvas ref="canvas" width="400" height="400" />
      </Fragment>
    );
  }

  draw = time => {
    const t = time * 0.001; // convert to seconds
    const dt = 0.016; // constant timestep for now
    this.particles = this.particles.map(particleUpdate, dt);
    // .filter(particleIsAlive);
    const ctx = this.context;
    const [w, h] = [this.context.canvas.width, this.context.canvas.height];
    ctx.clearRect(0, 0, w, h);

    this.particles.forEach(p => {
      ctx.fillRect(p.x, p.y, 8, 8);
    });

    // console.log(this.particles);
    this.animationFrameRequest = requestAnimationFrame(this.draw);
  };
}
