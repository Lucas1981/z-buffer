import * as Mat4 from "../math/mat4.js";
import { drawGeneralTriangle } from "../rasterizer/triangle.js";

function hexToRgba(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff, 255];
}

export function render(ctx, width, height, object3D, modelMatrix) {
  const aspect = width / height;
  const P = Mat4.perspective(aspect, 0.1, 100);
  const V = Mat4.identity();
  const MVP = Mat4.multiply(P, Mat4.multiply(V, modelMatrix));

  const screenVerts = object3D.vertices.map(({ x, y, z }) => {
    const clip = Mat4.transformVec4(MVP, [x, y, z, 1]);
    const w = clip[3];
    return [
      Math.round(((clip[0] / w) + 1) / 2 * width),
      Math.round((1 - (clip[1] / w)) / 2 * height),
    ];
  });

  const imageData = ctx.getImageData(0, 0, width, height);

  for (const { vertexIndices, color } of object3D.polygons) {
    const triangle = vertexIndices.map((i) => screenVerts[i]);
    drawGeneralTriangle(triangle, hexToRgba(color), imageData);
  }

  ctx.putImageData(imageData, 0, 0);
}
