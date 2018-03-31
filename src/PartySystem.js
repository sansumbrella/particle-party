import React, { Component } from "react";
import { List, Record } from "immutable";

const mix = (a, b, t) => a + (b - a) * t;

/**
 * Render as SVG overlaid on canvas.
 */
export class Emitter {
  constructor(props) {
    const { x = 100, y = 100, rate = 20 } = props;
    this.x = x;
    this.y = y;
    this.time = 0.0;
    this.frequency = 1 / rate;
  }
  /**
   * Returns an array of particles emitted during the current simulated interval.
   * @param {double} dt - amount of time to simulate
   */
  step(dt) {
    const totalTime = this.time + dt;
    const count = Math.floor(totalTime / this.frequency);
    this.time = totalTime - count * this.frequency;
    const { x, y } = this;

    const particles = [];
    for (let i = 0; i < count; i += 1) {
      particles.push(
        new Particle({
          x,
          y,
          vx: this.vx(),
          vy: this.vy(),
          individuality: Math.round(100 * Math.random()) / 100
        })
      );
    }

    return particles;
  }

  vx = () => {
    return mix(-100, 100, Math.random());
  };

  vy = () => {
    return mix(-100, -500, Math.random());
  };
}

export class Attractor {}

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
  return particle.age < 4;
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

/**
 * Renders a realtime particle system to Canvas.
 * Renders gui elements to SVG overlaid on the Canvas.
 */
export default class PartySystem extends Component {
  constructor(props) {
    super(props);

    this.particles = burst(new List(), { x: 200, y: 400 });
  }

  componentDidMount() {
    const { width, height } = this.props;
    const { canvas, gui } = this.refs;
    canvas.width = width;
    canvas.height = height;
    gui.setAttribute("width", width);
    gui.setAttribute("height", height);
    this.draw();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.animationFrameRequest);
  }

  render() {
    const { showGui } = this.props;
    const gui = this.props.emitters.map((em, index) => (
      <circle
        onMouseOver={evt => console.log("moused over", em)}
        onMouseUp={evt => console.log("mouse up", em)}
        onMouseDown={evt => console.log("mouse down", em)}
        key={index}
        cx={em.x}
        cy={em.y}
        r={10}
      />
    ));
    return (
      <div className="host">
        <canvas ref="canvas" />
        <svg ref="gui">{showGui && gui}</svg>
      </div>
    );
  }

  addParticles = location => {
    this.particles = this.particles.push(
      new Particle({
        individuality: Math.round(100 * Math.random()) / 100,
        ...location
      })
    );
  };

  draw = time => {
    const { emitters } = this.props;

    const newParticles = emitters
      .map(emitter => emitter.step(0.016))
      .reduce((collect, more) => collect.concat(more), []);

    this.particles = this.particles
      .filter(particleIsAlive)
      .push(...newParticles)
      .map(p => particleUpdate(p, 0.016));

    const { canvas } = this.refs;
    const ctx = canvas.getContext("2d");
    const [w, h] = [canvas.width, canvas.height];
    // ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `hsla(0, 0%, 100%, 0.2`;
    ctx.fillRect(0, 0, w, h);

    this.particles.forEach(p => {
      const hue = Math.round(p.individuality * 360);
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 1.0)`;
      ctx.fillText(p.individuality, p.x, p.y);
    });

    this.animationFrameRequest = requestAnimationFrame(this.draw);
  };
}
