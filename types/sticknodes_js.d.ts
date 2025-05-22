export type PolyfillOptions = { anchor_node_draw_index?: number, color?: Color, use_polyfill_color?: boolean, attached_node_draw_indices?: Array<number>, } 
export type NodeOptions = { node_type?: NodeType, is_static?: boolean, is_stretchy?: boolean, is_smart_stretch?: boolean, do_not_apply_smart_stretch?: boolean, use_segment_color?: boolean, use_circle_outline?: boolean, circle_is_hollow?: boolean, use_gradient?: boolean, reverse_gradient?: boolean, gradient_mode?: number, use_segment_scale?: boolean, local_x?: number, local_y?: number, scale?: number, default_length?: number, length?: number, default_thickness?: number, thickness?: number, segment_curve_radius_and_default_curve_radius?: number, curve_circulization?: boolean, segment_curve_polyfill_precision?: number, half_arc?: boolean, right_triangle_direction?: number, triangle_upside_down?: boolean, trapezoid_top_thickness_ratio?: number, num_polygon_vertices?: number, default_local_angle?: number, local_angle?: number, default_angle?: number, color?: Color, gradient_color?: Color, circle_outline_color?: Color, } /* tslint:disable */ /* eslint-disable */ /** @internal */
export function main(): void; export enum NodeType { RootNode = -1,
RoundedSegment = 0, Segment = 1,
Circle = 2,
Triangle = 3,
FilledCircle = 4,
Ellipse = 5,
Trapezoid = 6,
Polygon = 7,
}
export class Color { private constructor(); free(): void;
/**
 * Creates a new color from RGBA values.
 */
static from_rgba(red: number, green: number, blue: number, alpha: number): Color; /**
* Creates a new color from RGB values (assumes alpha is 255).
*/
static from_rgb(red: number, green: number, blue: number): Color; /**
* Creates a new color from a hex string.
* The string can be in the formats: "#RGB", "#RGBA", "#RRGGBB", "#RRGGBBAA", "RGB", "RGBA", "RRGGBB", or "RRGGBBAA" (case-insensitive). Any other format will fail.
*/
static from_hex(hex: string): Color; /**
* Converts the color to a hex string.
*/
to_hex(): string;
alpha: number;
blue: number;
green: number;
red: number;
}
export class Node { private constructor(); free(): void;
/**
 * Set the draw index of this node to a new draw index.
 * Will increment all indices that are >= the desired draw index if the desired draw index is already occupied.
 */
set_draw_index(draw_index: number): void; /**
* Get the index of every node that is a direct child of this node.
*/
get_child_indices(): Uint32Array; /**
* Get the reference of every node that is a direct child of this node.
*/
get_child_nodes(): Node[]; /**
* Get the index of every node that has the same parent as this node.
*/
get_sibling_indices(): Uint32Array; /**
* Get the reference of every node that has the same parent as this node.
*/
get_sibling_nodes(): Node[]; /**
* Get the index of every node that is a child of this node, recursively.
* Includes child nodes of child nodes of child nodes and so on.
* Use `get_child_indices()` to get only direct children of this node.
* Use `get_descendant_nodes()` to get the reference of descendant nodes instead.
*/
get_descendant_indices(): Uint32Array; /**
* Get the reference of every node that is a child of this node, recursively.
* Includes child nodes of child nodes of child nodes and so on.
* Use `get_child_nodes()` to get only direct children of this node.
* Use `get_descendant_indices()` to get the index of descendant nodes instead.
*/
get_descendant_nodes(): Node[]; /**
* Get the index of every node that is a parent of this node, recursively.
* Includes parent node of parent node of parent node and so on.
* Use `get_parent_index()` to get only the direct parent of this node.
* Use `get_ancestor_nodes()` to get the reference of ancestor nodes instead.
*/
get_ancestor_indices(): Uint32Array; /**
* Get the reference of every node that is a parent of this node, recursively.
* Includes parent node of parent node of parent node and so on.
* Use `get_parent_node()` to get only the direct parent of this node.
* Use `get_ancestor_indices()` to get the index of ancestor nodes instead.
*/
get_ancestor_nodes(): Node[]; /**
* Get the index of the direct parent of this node.
* Use `get_parent_node()` to get the reference of the parent node instead.
*/
get_parent_index(): number; /**
* Get the reference of the direct parent of this node.
* Use `get_parent_index()` to get the index of the parent node instead.
*/
get_parent_node(): Node; get_node_options(): NodeOptions; /**
* Add a new node as a sibling of this node (a child of this node's parent).
*/
add_sibling(options: NodeOptions): Node; /**
* Add a new node as a child of this node.
*/
add_child(options: NodeOptions): Node; /**
* Delete this current node.
*/
delete(): void;
readonly id: number; readonly stickfigure: Stickfigure; readonly draw_index: number; node_type: NodeType; color: Color;
gradient_color: Color; circle_outline_color: Color; is_static: boolean; is_stretchy: boolean; is_smart_stretch: boolean; do_not_apply_smart_stretch: boolean; use_segment_color: boolean; use_circle_outline: boolean; circle_is_hollow: boolean; use_gradient: boolean; reverse_gradient: boolean; gradient_mode: number; use_segment_scale: boolean; local_x: number;
local_y: number;
scale: number;
default_length: number; length: number;
default_thickness: number; thickness: number; segment_curve_radius_and_default_curve_radius: number; curve_circulization: boolean; segment_curve_polyfill_precision: number; half_arc: boolean; right_triangle_direction: number; triangle_upside_down: boolean; trapezoid_top_thickness_ratio: number; num_polygon_vertices: number; default_local_angle: number; local_angle: number; default_angle: number; }
export class Polyfill { private constructor(); free(): void;
/**
 * Attempts to set polyfill anchor node to supplied draw index.
 * Throws error if draw index is already occupied by a polyfill or is an invalid draw index.
 */
set_anchor_node_draw_index(draw_index: number): void; /**
* Sets the attached node draw indices * Throws error if any given node draw index is invalid */
set_attached_node_draw_indices(draw_indices: Int32Array): void; /**
* Inserts the given node draw indices after the given node draw index * Throws error if any given node draw index is invalid */
insert_attached_node_draw_indices_after(draw_indices: Int32Array, insert_after_draw_index: number): void; /**
* Inserts the given node draw indices before the given node draw index * Throws error if any given node draw index is invalid */
insert_attached_node_draw_indices_before(draw_indices: Int32Array, insert_before_draw_index: number): void; /**
* Removes the given node draw indices from the attached node draw indices.
* Throws error if any given node draw index is invalid */
remove_attached_node_draw_indices(draw_indices: Int32Array): void; /**
* Sets the attached node draw indices, processing only valid indices.
* Returns an array of indices that were actually set.
* Unlike `set_attached_node_draw_indices`, this method ignores invalid indices instead of erroring.
*/
try_set_attached_node_draw_indices(draw_indices: Int32Array): Int32Array; /**
* Removes the given node draw indices from the attached node draw indices, processing only valid indices.
* Returns an array of indices that were actually removed.
* Unlike `remove_attached_node_draw_indices`, this method ignores invalid indices instead of erroring.
*/
try_remove_attached_node_draw_indices(draw_indices: Int32Array): Int32Array; readonly stickfigure: Stickfigure; readonly id: number; readonly anchor_node_draw_index: number; color: Color;
use_polyfill_color: boolean; readonly attached_node_draw_indices: Int32Array; }
export class Stickfigure { free(): void;
/**
 * This is also test documentation changekjhasjfdh */
constructor();
static from_bytes(bytes: Uint8Array): Stickfigure; to_bytes(): Uint8Array; set_version(version_code: number): void; to_jsobject(): any; add_polyfill(options: any): Polyfill; get_polyfill(anchor_draw_index: number): Polyfill; get_all_polyfills(): Polyfill[]; get_node(draw_index: number): Node; get_nodes(draw_indices: Uint32Array): Node[]; get_all_node_indices(): Uint32Array; get_all_nodes(): Node[]; readonly id: number; readonly version: number; scale: number;
build: number;
color: Color;
}