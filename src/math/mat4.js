// Row-major 4x4 matrices. Vectors are column vectors multiplied on the right: v' = M * v.
// Arrays are laid out as [row0col0, row0col1, ..., row3col3].

export function identity() {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

export function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      for (let k = 0; k < 4; k++) {
        out[row * 4 + col] += a[row * 4 + k] * b[k * 4 + col];
      }
    }
  }
  return out;
}

export function transformVec4(m, v) {
  return [
    m[ 0]*v[0] + m[ 1]*v[1] + m[ 2]*v[2] + m[ 3]*v[3],
    m[ 4]*v[0] + m[ 5]*v[1] + m[ 6]*v[2] + m[ 7]*v[3],
    m[ 8]*v[0] + m[ 9]*v[1] + m[10]*v[2] + m[11]*v[3],
    m[12]*v[0] + m[13]*v[1] + m[14]*v[2] + m[15]*v[3],
  ];
}

export function translation(tx, ty, tz) {
  return [
    1, 0, 0, tx,
    0, 1, 0, ty,
    0, 0, 1, tz,
    0, 0, 0,  1,
  ];
}

export function rotationX(a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [
    1,  0,  0, 0,
    0,  c, -s, 0,
    0,  s,  c, 0,
    0,  0,  0, 1,
  ];
}

export function rotationY(a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [
     c, 0, s, 0,
     0, 1, 0, 0,
    -s, 0, c, 0,
     0, 0, 0, 1,
  ];
}

export function rotationZ(a) {
  const c = Math.cos(a), s = Math.sin(a);
  return [
    c, -s, 0, 0,
    s,  c, 0, 0,
    0,  0, 1, 0,
    0,  0, 0, 1,
  ];
}

export function scale(sx, sy, sz) {
  return [
    sx,  0,  0, 0,
     0, sy,  0, 0,
     0,  0, sz, 0,
     0,  0,  0, 1,
  ];
}

// Perspective projection looking down -Z.
// 90° FOV means tan(fov/2) = 1, so the focal length f = 1.
// Near plane -> NDC z = -1, far plane -> NDC z = +1.
export function perspective(aspect, near, far) {
  const f = 1; // 1 / tan(90° / 2)
  return [
    f / aspect,  0,                             0,                              0,
    0,           f,                             0,                              0,
    0,           0,  (far + near) / (near - far),  2 * far * near / (near - far),
    0,           0,                            -1,                              0,
  ];
}
