# @swim/scale

[![package](https://img.shields.io/npm/v/@swim/scale.svg)](https://www.npmjs.com/package/@swim/scale)
[![documentation](https://img.shields.io/badge/doc-TypeDoc-blue.svg)](https://docs.swimos.org/js/latest/modules/_swim_scale.html)
[![chat](https://img.shields.io/badge/chat-Gitter-green.svg)](https://gitter.im/swimos/community)

<a href="https://www.swimos.org"><img src="https://docs.swimos.org/readme/marlin-blue.svg" align="left"></a>

**@swim/scale** implements mappings from numeric and temporal input domains to
interpolated output ranges, with support for continuous domain clamping, domain
solving, range unscaling, and interpolation between scales. **@swim/scale** is part of the
[**@swim/ui**](https://github.com/swimos/swim/tree/master/swim-toolkit-js/swim-ui-js/@swim/ui) framework.

## Installation

### npm

For an npm-managed project, `npm install @swim/scale` to make it a dependency.
TypeScript sources will be installed into `node_modules/@swim/scale/main`.
Transpiled JavaScript and TypeScript definition files install into
`node_modules/@swim/scale/lib/main`.  And a pre-built UMD script can
be found in `node_modules/@swim/scale/dist/main/swim-scale.js`.

### Browser

Browser applications can load `swim-core.js`, which comes bundled with the
**@swim/scale** library, directly from the SwimOS CDN.

```html
<!-- Development -->
<script src="https://cdn.swimos.org/js/latest/swim-core.js"></script>

<!-- Production -->
<script src="https://cdn.swimos.org/js/latest/swim-core.min.js"></script>
```

Alternatively, the standalone `swim-system.js` script may be loaded
from the SwimOS CDN, which bundles **@swim/scale** together with all other
[**@swim/system**](https://github.com/swimos/swim/tree/master/swim-system-js/@swim/system)
libraries.

```html
<!-- Development -->
<script src="https://cdn.swimos.org/js/latest/swim-system.js"></script>

<!-- Production -->
<script src="https://cdn.swimos.org/js/latest/swim-system.min.js"></script>
```

## Usage

### ES6/TypeScript

**@swim/scale** can be imported as an ES6 module from TypeScript and other
ES6-compatible environments.

```typescript
import * as scale from "@swim/scale";
```

### CommonJS/Node.js

**@swim/scale** can also be used as a CommonJS module in Node.js applications.

```javascript
var scale = require("@swim/scale");
```

### Browser

When loaded by a web browser, the `swim-core.js` script adds all
**@swim/scale** library exports to the global `swim` namespace.

The `swim-system.js` script also adds all **@swim/scale** library exports
to the global `swim` namespace, making it a drop-in replacement for
`swim-core.js` when additional **@swim/system** libraries are needed.
