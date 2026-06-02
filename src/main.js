import cubeData from './assets/cube.json';
import * as Mat4 from './math/mat4.js';
import { render } from './render/renderer.js';

const WIDTH = 800;
const HEIGHT = 600;

const canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');

const TILT_X = Math.PI / 6; // 30° fixed tilt so we see the top face

function frame(timestamp) {
  const angle = (timestamp / 1000) * Math.PI * 0.5; // half rotation per second

  const modelMatrix = Mat4.multiply(
    Mat4.translation(0, 0, -5),
    Mat4.multiply(
      Mat4.rotationX(TILT_X),
      Mat4.rotationY(angle),
    ),
  );

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  render(ctx, WIDTH, HEIGHT, cubeData, modelMatrix);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
