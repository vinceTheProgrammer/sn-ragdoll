# sticknodes-js

This is the JavaScript/TypeScript bindings for [sticknodes-rs](https://github.com/vinceTheProgrammer/sticknodes-rs). It allows manipulation of Stick Nodes Stickfigures from within a web or Node.js environment.

## Installation

To install via NPM:
```bash
npm install sticknodes-js
```

## Usage
### In Node.js or Bundlers (e.g., Webpack, Rollup, Parcel)
```js
import { Stickfigure, NodeType, Color } from "sticknodes-js";

const stickfigure = new Stickfigure();
const rootNode = stickfigure.get_node(0)
const ball = rootNode.add_child({node_type: NodeType.Circle, length: 100, local_angle: 0, color: Color.from_hex("#000000")});
const ball2 = rootNode.add_child({node_type: NodeType.Circle, length: 100, local_angle: 180, color: Color.from_hex("#000000")});
const shaft = rootNode.add_child({node_type: NodeType.RoundedSegment, length: 200, local_angle: 90, thickness: 100, color: Color.from_hex("#000000")});
const obj = stickfigure.to_jsobject(); 
console.log(JSON.stringify(obj, undefined, 1));
```

### In the Browser (Web)
```html
<script type="module">
    import init, * as sn from "https://cdn.jsdelivr.net/npm/sticknodes-js@1.0.11/sticknodes_js_web.js";

    init().then(() => {
        const stickfigure = new sn.Stickfigure();
        const rootNode = stickfigure.get_node(0)
        rootNode.add_child({node_type: sn.NodeType.Circle, length: 100, local_angle: 0, color: sn.Color.from_hex("#000000")});
        rootNode.add_child({node_type: sn.NodeType.Circle, length: 100, local_angle: 180, color: sn.Color.from_hex("#000000")});
        rootNode.add_child({node_type: sn.NodeType.RoundedSegment, length: 200, local_angle: 90, thickness: 100, color: sn.Color.from_hex("#000000")});
        const obj = stickfigure.to_jsobject(); 
        console.log(JSON.stringify(obj, undefined, 1));
    });
</script>
```

## Documentation
Auto generated, detailed docs can be found [here](https://vincetheprogrammer.github.io/sticknodes-js/).

## TypeScript Definitions
The library includes TypeScript definitions to ensure smooth integration with TypeScript projects.

## License
MIT License - See [LICENSE](./LICENSE)