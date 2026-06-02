/**
 * Flat-shaded triangle rasterization (scanline) — linear z-buffer.
 * Vertices are [x, y, z] where z is NDC depth (-1 = near, +1 = far).
 * z is interpolated linearly in screen space (approximation).
 * zBuffer must be initialised to Infinity; closer pixels have smaller z.
 */

function fillTriangleFlatBottom(triangle, color, contextData, zBuffer) {
  const dxl = (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);
  const dxr = (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);
  const dzl = (triangle[0][2] - triangle[2][2]) / (triangle[0][1] - triangle[2][1]);
  const dzr = (triangle[0][2] - triangle[1][2]) / (triangle[0][1] - triangle[1][1]);

  let clx = triangle[0][0];
  let crx = triangle[0][0];
  let clz = triangle[0][2];
  let crz = triangle[0][2];

  for (let cy = triangle[0][1]; cy <= triangle[2][1]; cy++) {
    const isClLeft = crx > clx;
    const left  = Math.ceil(isClLeft ? clx : crx);
    const right = Math.ceil(isClLeft ? crx : clx);
    const leftZ  = isClLeft ? clz : crz;
    const rightZ = isClLeft ? crz : clz;

    const span = right - left;
    const dzScan = span > 0 ? (rightZ - leftZ) / span : 0;
    const base = (cy * contextData.width + left) * 4;

    for (let i = left; i <= right; i++) {
      const z = leftZ + (i - left) * dzScan;
      const pixelIdx = cy * contextData.width + i;
      if (z < zBuffer[pixelIdx]) {
        zBuffer[pixelIdx] = z;
        const off = base + (i - left) * 4;
        contextData.data[off]     = color[0];
        contextData.data[off + 1] = color[1];
        contextData.data[off + 2] = color[2];
        contextData.data[off + 3] = color[3];
      }
    }

    clx += dxl;
    crx += dxr;
    clz += dzl;
    crz += dzr;
  }
}

function fillTriangleFlatTop(triangle, color, contextData, zBuffer) {
  const dxl = (triangle[2][0] - triangle[0][0]) / (triangle[2][1] - triangle[0][1]);
  const dxr = (triangle[2][0] - triangle[1][0]) / (triangle[2][1] - triangle[1][1]);
  const dzl = (triangle[2][2] - triangle[0][2]) / (triangle[2][1] - triangle[0][1]);
  const dzr = (triangle[2][2] - triangle[1][2]) / (triangle[2][1] - triangle[1][1]);

  let clx = triangle[2][0];
  let crx = triangle[2][0];
  let clz = triangle[2][2];
  let crz = triangle[2][2];

  for (let cy = triangle[2][1]; cy >= triangle[0][1]; cy--) {
    const isClLeft = crx > clx;
    const left  = Math.ceil(isClLeft ? clx : crx);
    const right = Math.ceil(isClLeft ? crx : clx);
    const leftZ  = isClLeft ? clz : crz;
    const rightZ = isClLeft ? crz : clz;

    const span = right - left;
    const dzScan = span > 0 ? (rightZ - leftZ) / span : 0;
    const base = (cy * contextData.width + left) * 4;

    for (let i = left; i <= right; i++) {
      const z = leftZ + (i - left) * dzScan;
      const pixelIdx = cy * contextData.width + i;
      if (z < zBuffer[pixelIdx]) {
        zBuffer[pixelIdx] = z;
        const off = base + (i - left) * 4;
        contextData.data[off]     = color[0];
        contextData.data[off + 1] = color[1];
        contextData.data[off + 2] = color[2];
        contextData.data[off + 3] = color[3];
      }
    }

    clx -= dxl;
    crx -= dxr;
    clz -= dzl;
    crz -= dzr;
  }
}

/**
 * Draw a triangle (array of 3 [x, y, z] points) with flat color into contextData,
 * performing a z-buffer depth test per pixel.
 */
export function drawGeneralTriangle(triangle, color, contextData, zBuffer) {
  const tri = [...triangle].sort((a, b) => a[1] - b[1]);

  if (tri[1][1] === tri[2][1]) {
    fillTriangleFlatBottom(tri, color, contextData, zBuffer);
  } else if (tri[0][1] === tri[1][1]) {
    fillTriangleFlatTop(tri, color, contextData, zBuffer);
  } else {
    const t = (tri[1][1] - tri[0][1]) / (tri[2][1] - tri[0][1]);
    const v1 = [
      tri[0][0] + t * (tri[2][0] - tri[0][0]),
      tri[1][1],
      tri[0][2] + t * (tri[2][2] - tri[0][2]),
    ];
    fillTriangleFlatBottom([tri[0], tri[1], v1], color, contextData, zBuffer);
    fillTriangleFlatTop([tri[1], v1, tri[2]], color, contextData, zBuffer);
  }
}
