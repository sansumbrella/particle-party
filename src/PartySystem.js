import React, { Fragment, Component } from "react";
import { List, Record } from "immutable";

export class Particle extends Record({
  age: 0,
  individuality: Math.random(),
  x: 0,
  y: 0,
  vx: 0,
  vy: 0
}) {}

export const particleUpdate = (particle, dt = 0.016) => {
  return particle.withMutations(p => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 10.0; // gravity
    p.vy *= 0.99; // drag
    p.vx *= 0.99;
    p.age += dt;
  });
};

export const particleIsAlive = particle => {
  return particle.age < 10;
};

const burst = (particles, location) => {
  return particles.withMutations(system => {
    for (let i = 0; i < 100; i += 1) {
      system.push(
        new Particle({
          x: location.x,
          y: location.y,
          vx: 150 - Math.random() * 300,
          vy: -800 + Math.random() * 150,
          individuality: i / 100
        })
      );
    }
  });
};

export default class PartySystem extends Component {
  constructor(props) {
    super(props);

    this.particles = burst(new List(), { x: 200, y: 400 });
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
        <canvas
          ref="canvas"
          width="400"
          height="400"
          onClick={event => {
            this.particles = burst(this.particles, {
              x: event.nativeEvent.offsetX,
              y: event.nativeEvent.offsetY
            });
          }}
        />
      </Fragment>
    );
  }

  addParticles(location) {
    this.particles = this.particles.push(
      new Particle({
        individuality: Math.round(100 * Math.random()) / 100,
        ...location
      })
    );
  }

  draw = time => {
    this.particles = this.particles
      .filter(particleIsAlive)
      .map(p => particleUpdate(p, 0.016));
    const ctx = this.context;
    const [w, h] = [this.context.canvas.width, this.context.canvas.height];
    ctx.clearRect(0, 0, w, h);

    this.particles.forEach(p => {
      const hue = Math.round(p.individuality * 360);
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 1.0)`;
      ctx.fillText(p.individuality, p.x, p.y);
    });

    this.animationFrameRequest = requestAnimationFrame(this.draw);
  };
}
