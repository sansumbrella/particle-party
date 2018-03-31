import React, { Fragment, Component } from "react";
import { List, Record } from "immutable";

/**
 * Render as SVG overlaid on canvas.
 */
export class Emitter {
  constructor(props) {
    const { x = 100, y = 100 } = props;
    this.x = x;
    this.y = y;
  }
  /**
   * Returns an array of particles emitted during the current simulated interval.
   * @param {double} dt - amount of time to simulate
   */
  step(dt) {}
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
    const gui = this.props.emitters.map(em => (
      <circle cx={em.x} cy={em.y} r={10} />
    ));
    return (
      <div className="host">
        <canvas ref="canvas" />
        <svg
          ref="gui"
          onClick={event => {
            this.particles = burst(this.particles, {
              x: event.nativeEvent.offsetX,
              y: event.nativeEvent.offsetY
            });
          }}
        >
          {showGui && gui}
        </svg>
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
    console.log(this.props.children);
    this.particles = this.particles
      .filter(particleIsAlive)
      .map(p => particleUpdate(p, 0.016));
    const { canvas } = this.refs;
    const ctx = canvas.getContext("2d");
    const [w, h] = [canvas.width, canvas.height];
    ctx.clearRect(0, 0, w, h);

    this.particles.forEach(p => {
      const hue = Math.round(p.individuality * 360);
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, 1.0)`;
      ctx.fillText(p.individuality, p.x, p.y);
    });

    this.animationFrameRequest = requestAnimationFrame(this.draw);
  };
}
