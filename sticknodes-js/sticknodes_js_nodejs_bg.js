import { TextEncoder, TextDecoder } from 'util';

let wasm;
let wasmModule;
export function __wbg_set_wasm(exports, module) {
    wasm = exports;
    wasmModule = module;
}


let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_4.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_4.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_4.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedInt32ArrayMemory0 = null;

function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

export function main() {
    wasm.main();
}

/**
 * @enum {-1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
export const NodeType = Object.freeze({
    RootNode: -1, "-1": "RootNode",
    RoundedSegment: 0, "0": "RoundedSegment",
    Segment: 1, "1": "Segment",
    Circle: 2, "2": "Circle",
    Triangle: 3, "3": "Triangle",
    FilledCircle: 4, "4": "FilledCircle",
    Ellipse: 5, "5": "Ellipse",
    Trapezoid: 6, "6": "Trapezoid",
    Polygon: 7, "7": "Polygon",
});

const ColorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_color_free(ptr >>> 0, 1));

export class Color {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Color.prototype);
        obj.__wbg_ptr = ptr;
        ColorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ColorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_color_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get alpha() {
        const ret = wasm.__wbg_get_color_alpha(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set alpha(arg0) {
        wasm.__wbg_set_color_alpha(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get blue() {
        const ret = wasm.__wbg_get_color_blue(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set blue(arg0) {
        wasm.__wbg_set_color_blue(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get green() {
        const ret = wasm.__wbg_get_color_green(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set green(arg0) {
        wasm.__wbg_set_color_green(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get red() {
        const ret = wasm.__wbg_get_color_red(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set red(arg0) {
        wasm.__wbg_set_color_red(this.__wbg_ptr, arg0);
    }
    /**
     * Creates a new color from RGBA values.
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @param {number} alpha
     * @returns {Color}
     */
    static from_rgba(red, green, blue, alpha) {
        const ret = wasm.color_from_rgba(red, green, blue, alpha);
        return Color.__wrap(ret);
    }
    /**
     * Creates a new color from RGB values (assumes alpha is 255).
     * @param {number} red
     * @param {number} green
     * @param {number} blue
     * @returns {Color}
     */
    static from_rgb(red, green, blue) {
        const ret = wasm.color_from_rgb(red, green, blue);
        return Color.__wrap(ret);
    }
    /**
     * Creates a new color from a hex string.
     * The string can be in the formats: "#RGB", "#RGBA", "#RRGGBB", "#RRGGBBAA", "RGB", "RGBA", "RRGGBB", or "RRGGBBAA" (case-insensitive). Any other format will fail.
     * @param {string} hex
     * @returns {Color}
     */
    static from_hex(hex) {
        const ptr0 = passStringToWasm0(hex, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.color_from_hex(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Color.__wrap(ret[0]);
    }
    /**
     * Converts the color to a hex string.
     * @returns {string}
     */
    to_hex() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.color_to_hex(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const NodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_node_free(ptr >>> 0, 1));

export class Node {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Node.prototype);
        obj.__wbg_ptr = ptr;
        NodeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_node_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.node_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Stickfigure}
     */
    get stickfigure() {
        const ret = wasm.node_stickfigure(this.__wbg_ptr);
        return Stickfigure.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get draw_index() {
        const ret = wasm.node_draw_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {NodeType}
     */
    get node_type() {
        const ret = wasm.node_node_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {NodeType} node_type
     */
    set node_type(node_type) {
        wasm.node_set_node_type(this.__wbg_ptr, node_type);
    }
    /**
     * @returns {Color}
     */
    get color() {
        const ret = wasm.node_color(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * @param {Color} color
     */
    set color(color) {
        _assertClass(color, Color);
        var ptr0 = color.__destroy_into_raw();
        wasm.node_set_color(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Color}
     */
    get gradient_color() {
        const ret = wasm.node_gradient_color(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * @param {Color} color
     */
    set gradient_color(color) {
        _assertClass(color, Color);
        var ptr0 = color.__destroy_into_raw();
        wasm.node_set_gradient_color(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Color}
     */
    get circle_outline_color() {
        const ret = wasm.node_circle_outline_color(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * @param {Color} color
     */
    set circle_outline_color(color) {
        _assertClass(color, Color);
        var ptr0 = color.__destroy_into_raw();
        wasm.node_set_circle_outline_color(this.__wbg_ptr, ptr0);
    }
    /**
     * Set the draw index of this node to a new draw index.
     * Will increment all indices that are >= the desired draw index if the desired draw index is already occupied.
     * @param {number} draw_index
     */
    set_draw_index(draw_index) {
        const ret = wasm.node_set_draw_index(this.__wbg_ptr, draw_index);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Get the index of every node that is a direct child of this node.
     * @returns {Uint32Array}
     */
    get_child_indices() {
        const ret = wasm.node_get_child_indices(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the reference of every node that is a direct child of this node.
     * @returns {Node[]}
     */
    get_child_nodes() {
        const ret = wasm.node_get_child_nodes(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the index of every node that has the same parent as this node.
     * @returns {Uint32Array}
     */
    get_sibling_indices() {
        const ret = wasm.node_get_sibling_indices(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the reference of every node that has the same parent as this node.
     * @returns {Node[]}
     */
    get_sibling_nodes() {
        const ret = wasm.node_get_sibling_nodes(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the index of every node that is a child of this node, recursively.
     * Includes child nodes of child nodes of child nodes and so on.
     * Use `get_child_indices()` to get only direct children of this node.
     * Use `get_descendant_nodes()` to get the reference of descendant nodes instead.
     * @returns {Uint32Array}
     */
    get_descendant_indices() {
        const ret = wasm.node_get_descendant_indices(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the reference of every node that is a child of this node, recursively.
     * Includes child nodes of child nodes of child nodes and so on.
     * Use `get_child_nodes()` to get only direct children of this node.
     * Use `get_descendant_indices()` to get the index of descendant nodes instead.
     * @returns {Node[]}
     */
    get_descendant_nodes() {
        const ret = wasm.node_get_descendant_nodes(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the index of every node that is a parent of this node, recursively.
     * Includes parent node of parent node of parent node and so on.
     * Use `get_parent_index()` to get only the direct parent of this node.
     * Use `get_ancestor_nodes()` to get the reference of ancestor nodes instead.
     * @returns {Uint32Array}
     */
    get_ancestor_indices() {
        const ret = wasm.node_get_ancestor_indices(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the reference of every node that is a parent of this node, recursively.
     * Includes parent node of parent node of parent node and so on.
     * Use `get_parent_node()` to get only the direct parent of this node.
     * Use `get_ancestor_indices()` to get the index of ancestor nodes instead.
     * @returns {Node[]}
     */
    get_ancestor_nodes() {
        const ret = wasm.node_get_ancestor_nodes(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Get the index of the direct parent of this node.
     * Use `get_parent_node()` to get the reference of the parent node instead.
     * @returns {number}
     */
    get_parent_index() {
        const ret = wasm.node_get_parent_index(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] >>> 0;
    }
    /**
     * Get the reference of the direct parent of this node.
     * Use `get_parent_index()` to get the index of the parent node instead.
     * @returns {Node}
     */
    get_parent_node() {
        const ret = wasm.node_get_parent_node(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Node.__wrap(ret[0]);
    }
    /**
     * @returns {any}
     */
    get_node_options() {
        const ret = wasm.node_get_node_options(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Add a new node as a sibling of this node (a child of this node's parent).
     * @param {any} options
     * @returns {Node}
     */
    add_sibling(options) {
        const ret = wasm.node_add_sibling(this.__wbg_ptr, options);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Node.__wrap(ret[0]);
    }
    /**
     * Add a new node as a child of this node.
     * @param {any} options
     * @returns {Node}
     */
    add_child(options) {
        const ret = wasm.node_add_child(this.__wbg_ptr, options);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Node.__wrap(ret[0]);
    }
    /**
     * Delete this current node.
     */
    delete() {
        const ret = wasm.node_delete(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {boolean}
     */
    get is_static() {
        const ret = wasm.node_is_static(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set is_static(value) {
        wasm.node_set_is_static(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get is_stretchy() {
        const ret = wasm.node_is_stretchy(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set is_stretchy(value) {
        wasm.node_set_is_stretchy(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get is_smart_stretch() {
        const ret = wasm.node_is_smart_stretch(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set is_smart_stretch(value) {
        wasm.node_set_is_smart_stretch(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get do_not_apply_smart_stretch() {
        const ret = wasm.node_do_not_apply_smart_stretch(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set do_not_apply_smart_stretch(value) {
        wasm.node_set_do_not_apply_smart_stretch(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get use_segment_color() {
        const ret = wasm.node_use_segment_color(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set use_segment_color(value) {
        wasm.node_set_use_segment_color(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get use_circle_outline() {
        const ret = wasm.node_use_circle_outline(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set use_circle_outline(value) {
        wasm.node_set_use_circle_outline(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get circle_is_hollow() {
        const ret = wasm.node_circle_is_hollow(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set circle_is_hollow(value) {
        wasm.node_set_circle_is_hollow(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get use_gradient() {
        const ret = wasm.node_use_gradient(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set use_gradient(value) {
        wasm.node_set_use_gradient(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get reverse_gradient() {
        const ret = wasm.node_reverse_gradient(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set reverse_gradient(value) {
        wasm.node_set_reverse_gradient(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get gradient_mode() {
        const ret = wasm.node_gradient_mode(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set gradient_mode(value) {
        wasm.node_set_gradient_mode(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get use_segment_scale() {
        const ret = wasm.node_use_segment_scale(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set use_segment_scale(value) {
        wasm.node_set_use_segment_scale(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get local_x() {
        const ret = wasm.node_local_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set local_x(value) {
        wasm.node_set_local_x(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get local_y() {
        const ret = wasm.node_local_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set local_y(value) {
        wasm.node_set_local_y(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get scale() {
        const ret = wasm.node_scale(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set scale(value) {
        wasm.node_set_scale(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get default_length() {
        const ret = wasm.node_default_length(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set default_length(value) {
        wasm.node_set_default_length(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get length() {
        const ret = wasm.node_length(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set length(value) {
        wasm.node_set_length(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get default_thickness() {
        const ret = wasm.node_default_thickness(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set default_thickness(value) {
        wasm.node_set_default_thickness(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get thickness() {
        const ret = wasm.node_thickness(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set thickness(value) {
        wasm.node_set_thickness(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get segment_curve_radius_and_default_curve_radius() {
        const ret = wasm.node_segment_curve_radius_and_default_curve_radius(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set segment_curve_radius_and_default_curve_radius(value) {
        wasm.node_set_segment_curve_radius_and_default_curve_radius(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get curve_circulization() {
        const ret = wasm.node_curve_circulization(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set curve_circulization(value) {
        wasm.node_set_curve_circulization(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get segment_curve_polyfill_precision() {
        const ret = wasm.node_segment_curve_polyfill_precision(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set segment_curve_polyfill_precision(value) {
        wasm.node_set_segment_curve_polyfill_precision(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get half_arc() {
        const ret = wasm.node_half_arc(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set half_arc(value) {
        wasm.node_set_half_arc(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get right_triangle_direction() {
        const ret = wasm.node_right_triangle_direction(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set right_triangle_direction(value) {
        wasm.node_set_right_triangle_direction(this.__wbg_ptr, value);
    }
    /**
     * @returns {boolean}
     */
    get triangle_upside_down() {
        const ret = wasm.node_triangle_upside_down(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} value
     */
    set triangle_upside_down(value) {
        wasm.node_set_triangle_upside_down(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get trapezoid_top_thickness_ratio() {
        const ret = wasm.node_trapezoid_top_thickness_ratio(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set trapezoid_top_thickness_ratio(value) {
        wasm.node_set_trapezoid_top_thickness_ratio(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get num_polygon_vertices() {
        const ret = wasm.node_num_polygon_vertices(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set num_polygon_vertices(value) {
        wasm.node_set_num_polygon_vertices(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get default_local_angle() {
        const ret = wasm.node_default_local_angle(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set default_local_angle(value) {
        wasm.node_set_default_local_angle(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get local_angle() {
        const ret = wasm.node_local_angle(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set local_angle(value) {
        wasm.node_set_local_angle(this.__wbg_ptr, value);
    }
    /**
     * @returns {number}
     */
    get default_angle() {
        const ret = wasm.node_default_angle(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} value
     */
    set default_angle(value) {
        wasm.node_set_default_angle(this.__wbg_ptr, value);
    }
}

const PolyfillFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_polyfill_free(ptr >>> 0, 1));

export class Polyfill {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Polyfill.prototype);
        obj.__wbg_ptr = ptr;
        PolyfillFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PolyfillFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_polyfill_free(ptr, 0);
    }
    /**
     * @returns {Stickfigure}
     */
    get stickfigure() {
        const ret = wasm.polyfill_stickfigure(this.__wbg_ptr);
        return Stickfigure.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.polyfill_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get anchor_node_draw_index() {
        const ret = wasm.polyfill_anchor_node_draw_index(this.__wbg_ptr);
        return ret;
    }
    /**
     * Attempts to set polyfill anchor node to supplied draw index.
     * Throws error if draw index is already occupied by a polyfill or is an invalid draw index.
     * @param {number} draw_index
     */
    set_anchor_node_draw_index(draw_index) {
        const ret = wasm.polyfill_set_anchor_node_draw_index(this.__wbg_ptr, draw_index);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {Color}
     */
    get color() {
        const ret = wasm.polyfill_color(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * @param {Color} color
     */
    set color(color) {
        _assertClass(color, Color);
        var ptr0 = color.__destroy_into_raw();
        wasm.polyfill_set_color(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {boolean}
     */
    get use_polyfill_color() {
        const ret = wasm.polyfill_use_polyfill_color(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} use_polyfill_color
     */
    set use_polyfill_color(use_polyfill_color) {
        wasm.polyfill_set_use_polyfill_color(this.__wbg_ptr, use_polyfill_color);
    }
    /**
     * @returns {Int32Array}
     */
    get attached_node_draw_indices() {
        const ret = wasm.polyfill_attached_node_draw_indices(this.__wbg_ptr);
        var v1 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * Sets the attached node draw indices
     * Throws error if any given node draw index is invalid
     * @param {Int32Array} draw_indices
     */
    set_attached_node_draw_indices(draw_indices) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.polyfill_set_attached_node_draw_indices(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Inserts the given node draw indices after the given node draw index
     * Throws error if any given node draw index is invalid
     * @param {Int32Array} draw_indices
     * @param {number} insert_after_draw_index
     */
    insert_attached_node_draw_indices_after(draw_indices, insert_after_draw_index) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.polyfill_insert_attached_node_draw_indices_after(this.__wbg_ptr, ptr0, len0, insert_after_draw_index);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Inserts the given node draw indices before the given node draw index
     * Throws error if any given node draw index is invalid
     * @param {Int32Array} draw_indices
     * @param {number} insert_before_draw_index
     */
    insert_attached_node_draw_indices_before(draw_indices, insert_before_draw_index) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.polyfill_insert_attached_node_draw_indices_before(this.__wbg_ptr, ptr0, len0, insert_before_draw_index);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Removes the given node draw indices from the attached node draw indices.
     * Throws error if any given node draw index is invalid
     * @param {Int32Array} draw_indices
     */
    remove_attached_node_draw_indices(draw_indices) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.polyfill_remove_attached_node_draw_indices(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Sets the attached node draw indices, processing only valid indices.
     * Returns an array of indices that were actually set.
     * Unlike `set_attached_node_draw_indices`, this method ignores invalid indices instead of erroring.
     * @param {Int32Array} draw_indices
     * @returns {Int32Array}
     */
    try_set_attached_node_draw_indices(draw_indices) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.polyfill_try_set_attached_node_draw_indices(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * Removes the given node draw indices from the attached node draw indices, processing only valid indices.
     * Returns an array of indices that were actually removed.
     * Unlike `remove_attached_node_draw_indices`, this method ignores invalid indices instead of erroring.
     * @param {Int32Array} draw_indices
     * @returns {Int32Array}
     */
    try_remove_attached_node_draw_indices(draw_indices) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.polyfill_try_remove_attached_node_draw_indices(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayI32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
}

const StickfigureFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stickfigure_free(ptr >>> 0, 1));

export class Stickfigure {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Stickfigure.prototype);
        obj.__wbg_ptr = ptr;
        StickfigureFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StickfigureFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stickfigure_free(ptr, 0);
    }
    /**
     * This is also test documentation changekjhasjfdh
     */
    constructor() {
        const ret = wasm.stickfigure_new();
        this.__wbg_ptr = ret >>> 0;
        StickfigureFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {Uint8Array} bytes
     * @returns {Stickfigure}
     */
    static from_bytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.stickfigure_from_bytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Stickfigure.__wrap(ret[0]);
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.stickfigure_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Uint8Array}
     */
    to_bytes() {
        const ret = wasm.stickfigure_to_bytes(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.stickfigure_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} version_code
     */
    set_version(version_code) {
        const ret = wasm.stickfigure_set_version(this.__wbg_ptr, version_code);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * @returns {number}
     */
    get scale() {
        const ret = wasm.stickfigure_scale(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} scale
     */
    set scale(scale) {
        wasm.stickfigure_set_scale(this.__wbg_ptr, scale);
    }
    /**
     * @returns {number}
     */
    get build() {
        const ret = wasm.stickfigure_build(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} build
     */
    set build(build) {
        wasm.stickfigure_set_build(this.__wbg_ptr, build);
    }
    /**
     * @returns {Color}
     */
    get color() {
        const ret = wasm.stickfigure_color(this.__wbg_ptr);
        return Color.__wrap(ret);
    }
    /**
     * @param {Color} color
     */
    set color(color) {
        _assertClass(color, Color);
        var ptr0 = color.__destroy_into_raw();
        wasm.stickfigure_set_color(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {any}
     */
    to_jsobject() {
        const ret = wasm.stickfigure_to_jsobject(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {any} options
     * @returns {Polyfill}
     */
    add_polyfill(options) {
        const ret = wasm.stickfigure_add_polyfill(this.__wbg_ptr, options);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Polyfill.__wrap(ret[0]);
    }
    /**
     * @param {number} anchor_draw_index
     * @returns {Polyfill}
     */
    get_polyfill(anchor_draw_index) {
        const ret = wasm.stickfigure_get_polyfill(this.__wbg_ptr, anchor_draw_index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Polyfill.__wrap(ret[0]);
    }
    /**
     * @returns {Polyfill[]}
     */
    get_all_polyfills() {
        const ret = wasm.stickfigure_get_all_polyfills(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {number} draw_index
     * @returns {Node}
     */
    get_node(draw_index) {
        const ret = wasm.stickfigure_get_node(this.__wbg_ptr, draw_index);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Node.__wrap(ret[0]);
    }
    /**
     * @param {Uint32Array} draw_indices
     * @returns {Node[]}
     */
    get_nodes(draw_indices) {
        const ptr0 = passArray32ToWasm0(draw_indices, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.stickfigure_get_nodes(this.__wbg_ptr, ptr0, len0);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * @returns {Uint32Array}
     */
    get_all_node_indices() {
        const ret = wasm.stickfigure_get_all_node_indices(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {Node[]}
     */
    get_all_nodes() {
        const ret = wasm.stickfigure_get_all_nodes(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_buffer_609cc3eee51ed158(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_call_672a4d21634d4a24() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_done_769e5ede4b31c67b(arg0) {
    const ret = arg0.done;
    return ret;
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_get_67b2ba62fc30de12() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_b9b93047fe3cf45b(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_getwithrefkey_1dc361bd10053bfe(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_instanceof_ArrayBuffer_e14585432e3737fc(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_17156bcf118086a9(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_isArray_a1eab7e0d067391b(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isSafeInteger_343e2beeeece1bb0(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

export function __wbg_iterator_9a24c88df860dc65() {
    const ret = Symbol.iterator;
    return ret;
};

export function __wbg_length_a446193dc22c12f8(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_e2d2a49132c1b256(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_new_405e22f390576ce2() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_78feb108b6472713() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_a12002a7f91c75be(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_next_25feadfc0913fea9(arg0) {
    const ret = arg0.next;
    return ret;
};

export function __wbg_next_6574e1a8a62d1055() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_node_new(arg0) {
    const ret = Node.__wrap(arg0);
    return ret;
};

export function __wbg_polyfill_new(arg0) {
    const ret = Polyfill.__wrap(arg0);
    return ret;
};

export function __wbg_set_37837023f3d740e8(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

export function __wbg_set_65595bdd868b3009(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_value_cd1ffa7b1ab794f1(arg0) {
    const ret = arg0.value;
    return ret;
};

export function __wbindgen_as_number(arg0) {
    const ret = +arg0;
    return ret;
};

export function __wbindgen_boolean_get(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_error_new(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbindgen_in(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_4;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbindgen_is_object(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

