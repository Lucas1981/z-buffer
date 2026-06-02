# z-buffer

So here we show how to use the z-buffer. We include the methods that use `z` itself and the one that interpolates between `1/z` values. Nowadays it is probably cheap enough to go with the perspective-correct `1/z` interpolations. To use either of the `z` or `1/z` methods requires a bit of tinkering in `renderer.js` though, but it is indicated in the comments.

I've also added backface culling, which is surprisingly easy to do in screen space rather than in camera space. This will get rid of the pixel "halo" surrounding the cube, because of pixels vying for the same spot in relatively ambiguous areas where two surface edges are very close to each other.
