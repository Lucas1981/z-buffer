import cubeData from './assets/cube.json';
import * as Mat4 from './math/mat4.js';
import { render } from './render/renderer.js';

const WIDTH = 800;
const HEIGHT = 600;

const canvas = document.getElementById('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');

// Place the cube 5 units in front of the camera, tilted so multiple faces are visible.
const modelMatrix = Mat4.multiply(
  Mat4.translation(0, 0, -5),
  Mat4.multiply(
    Mat4.rotationX(Math.PI / 6),  // 30° tilt down
    Mat4.rotationY(Math.PI / 4),  // 45° turn
  ),
);

ctx.fillStyle = '#111';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

render(ctx, WIDTH, HEIGHT, cubeData, modelMatrix);
