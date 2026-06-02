/**
 * Flat-shaded triangle rasterization (scanline) — perspective-correct z-buffer.
 * Vertices are [x, y, invW] where invW = 1/w (w = clip-space w = -z_eye).
 * 1/w interpolates linearly in screen space, making this depth test exact.
 * zBuffer must be initialised to 0; closer pixels have larger invW.
 */

function fillTriangleFlatBottom(triangle, color, contextData, zBuffer) {
  const dxl   = (triangle[0][0] - triangle[2][0]) / (triangle[0][1] - triangle[2][1]);
  const dxr   = (triangle[0][0] - triangle[1][0]) / (triangle[0][1] - triangle[1][1]);
  const dinvwl = (triangle[0][2] - triangle[2][2]) / (triangle[0][1] - triangle[2][1]);
  const dinvwr = (triangle[0][2] - triangle[1][2]) / (triangle[0][1] - triangle[1][1]);

  let clx    = triangle[0][0];
  let crx    = triangle[0][0];
  let clinvw = triangle[0][2];
  let crinvw = triangle[0][2];

  for (let cy = triangle[0][1]; cy <= triangle[2][1]; cy++) {
    const isClLeft  = crx > clx;
    const left      = Math.ceil(isClLeft ? clx    : crx);
    const right     = Math.ceil(isClLeft ? crx    : clx);
    const leftInvW  = isClLeft ? clinvw : crinvw;
    const rightInvW = isClLeft ? crinvw : clinvw;

    const span       = right - left;
    const dinvwScan  = span > 0 ? (rightInvW - leftInvW) / span : 0;
    const base       = (cy * contextData.width + left) * 4;

    for (let i = left; i <= right; i++) {
      const invW     = leftInvW + (i - left) * dinvwScan;
      const pixelIdx = cy * contextData.width + i;
      if (invW > zBuffer[pixelIdx]) {
        zBuffer[pixelIdx] = invW;
        const off = base + (i - left) * 4;
        contextData.data[off]     = color[0];
        contextData.data[off + 1] = color[1];
        contextData.data[off + 2] = color[2];
        contextData.data[off + 3] = color[3];
      }
    }

    clx    += dxl;
    crx    += dxr;
    clinvw += dinvwl;
    crinvw += dinvwr;
  }
}

function fillTriangleFlatTop(triangle, color, contextData, zBuffer) {
  const dxl    = (triangle[2][0] - triangle[0][0]) / (triangle[2][1] - triangle[0][1]);
  const dxr    = (triangle[2][0] - triangle[1][0]) / (triangle[2][1] - triangle[1][1]);
  const dinvwl = (triangle[2][2] - triangle[0][2]) / (triangle[2][1] - triangle[0][1]);
  const dinvwr = (triangle[2][2] - triangle[1][2]) / (triangle[2][1] - triangle[1][1]);

  let clx    = triangle[2][0];
  let crx    = triangle[2][0];
  let clinvw = triangle[2][2];
  let crinvw = triangle[2][2];

  for (let cy = triangle[2][1]; cy >= triangle[0][1]; cy--) {
    const isClLeft  = crx > clx;
    const left      = Math.ceil(isClLeft ? clx    : crx);
    const right     = Math.ceil(isClLeft ? crx    : clx);
    const leftInvW  = isClLeft ? clinvw : crinvw;
    const rightInvW = isClLeft ? crinvw : clinvw;

    const span      = right - left;
    const dinvwScan = span > 0 ? (rightInvW - leftInvW) / span : 0;
    const base      = (cy * contextData.width + left) * 4;

    for (let i = left; i <= right; i++) {
      const invW     = leftInvW + (i - left) * dinvwScan;
      const pixelIdx = cy * contextData.width + i;
      if (invW > zBuffer[pixelIdx]) {
        zBuffer[pixelIdx] = invW;
        const off = base + (i - left) * 4;
        contextData.data[off]     = color[0];
        contextData.data[off + 1] = color[1];
        contextData.data[off + 2] = color[2];
        contextData.data[off + 3] = color[3];
      }
    }

    clx    -= dxl;
    crx    -= dxr;
    clinvw -= dinvwl;
    crinvw -= dinvwr;
  }
}

/**
 * Draw a triangle (array of 3 [x, y, invW] points) with flat color into contextData,
 * performing a perspective-correct depth test per pixel.
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
